import Stripe from "stripe";
import db from "../datab.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { userId } = req.body;

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  try {
    const userResult = await db.query("SELECT cart FROM users WHERE id = $1", [userId]);
    const cart = userResult.rows[0]?.cart || [];

    if (cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const lineItems = cart.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(Number(item.price) * 100), 
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${clientUrl}/cart?success=true`,
      cancel_url: `${clientUrl}/cart?canceled=true`,
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
};