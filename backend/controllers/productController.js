import db from "../datab.js";
import React from "react";
async function getProducts(req,res){
    try{
        const result = await db.query("SELECT * FROM products");
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
}
export const searchProducts = async (req, res) => {
  const { q } = req.query; 
  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM products WHERE prodname ILIKE $1 OR description ILIKE $1", 
      [`%${q}%`]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export async function getSingleProduct(req, res) {
  try {
    const id = req.params.id;
    const result = await db.query("SELECT * FROM products WHERE prod_id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}
export async function addReview(req, res) {
  try {
    const id = req.params.id;
    const { user, rating, text, date } = req.body;

    const product = await db.query(
      "SELECT reviews FROM products WHERE prod_id = $1",
      [id]
    );

    if (product.rows.length === 0)
      return res.status(404).json({ message: "Product not found" });

    let reviews = product.rows[0].reviews;
    reviews = reviews ? JSON.parse(reviews) : [];

    const newReview = { user, rating, text, date };
    reviews.push(newReview);

    await db.query(
      "UPDATE products SET reviews = $1 WHERE prod_id = $2",
      [JSON.stringify(reviews), id]
    );

    res.json({ message: "Review added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}


export default getProducts;