import db from "../datab.js"; 

export const placeOrder = async (req, res) => {
  const { userId } = req.body;

  try {
    const userResult = await db.query("SELECT cart FROM users WHERE id = $1", [userId]);
    const cart = userResult.rows[0]?.cart || [];

    if (cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    for (const item of cart) {
      await db.query(
        "INSERT INTO orders (user_id, product_id, quantity, totalam) VALUES ($1, $2, $3, $4)",
        [
          userId,
          item.id,                   
          item.quantity,             
          item.price * item.quantity  
        ]
      );
    }
    await db.query("UPDATE users SET cart = '[]'::jsonb WHERE id = $1", [userId]);
    res.json({ success: true, message: "Order placed successfully!" });
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

export const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query(
      `SELECT o.ordid, o.quantity, o.totalam, p.prodname, p.prodimg, p.price 
       FROM orders o 
       JOIN products p ON o.product_id = p.prod_id 
       WHERE o.user_id = $1 
       ORDER BY o.ordid DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};