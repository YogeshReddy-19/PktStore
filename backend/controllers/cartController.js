import db from "../datab.js";

export const addToCart = async (req, res) => {
  const { userId, product } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "User not logged in" });
  }

  if (!product || !product.id) {
    return res.status(400).json({ error: "Product data is missing ID" });
  }

  try {
    const userResult = await db.query("SELECT cart FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    let currentCart = userResult.rows[0]?.cart || [];
    const existingItemIndex = currentCart.findIndex(
      (item) => String(item.id) === String(product.id)
    );

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }

    await db.query("UPDATE users SET cart = $1::jsonb WHERE id = $2", [
      JSON.stringify(currentCart),
      userId,
    ]);

    res.status(200).json({ message: "Cart updated", cart: currentCart });
  } catch (err) {
    console.error("Error in addToCart:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.params;

  if (!userId || userId === "undefined" || userId === "null") {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    const result = await db.query("SELECT cart FROM users WHERE id = $1", [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]?.cart || []);
  } catch (err) {
    console.error("Error in getCart:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCartItem = async (req, res) => {
  const { userId, productId, action } = req.body;
  
  if (!userId) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    const userResult = await db.query("SELECT cart FROM users WHERE id = $1", [userId]);
    let currentCart = userResult.rows[0]?.cart || [];

    const itemIndex = currentCart.findIndex(
      (item) => String(item.id) === String(productId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (action === "increase") {
      currentCart[itemIndex].quantity += 1;
    } 
    else if (action === "decrease") {
      const newQty = currentCart[itemIndex].quantity - 1;
      if (newQty > 0) {
        currentCart[itemIndex].quantity = newQty;
      } else {
        currentCart.splice(itemIndex, 1);
      }
    } 
    else if (action === "remove") {
      currentCart.splice(itemIndex, 1);
    }

    await db.query("UPDATE users SET cart = $1::jsonb WHERE id = $2", [
      JSON.stringify(currentCart),
      userId,
    ]);

    res.json(currentCart);

  } catch (err) {
    console.error("Error in updateCartItem:", err);
    res.status(500).json({ error: "Server error" });
  }
};