import pool from "../config/db.config.js";

// async ფუნქცია პროდუქტის მოსატანად
async function getProducts(req, res) {
  // ქვემოთ დაკომენტარებულია რეალური მონაცემების წამოღება ბაზიდან:
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getOneProduct(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id =$1", [
      id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Interval server error" });
  }
}

async function createProduct(req, res) {
  try {
    const { name, price } = req.body;
    const result = await pool.query(
      "INSERT INTO products (name,price) VALUES ($1,$2) RETURNING *",
      [name, price]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Interval server error" });
  }
}
async function updateProduct(req, res) {
  try {
    const { id } = req.params; // URL-დან იღებს პროდუქტის ID-ს
    const { name, price, stock, description, slug, category } = req.body; // request body-დან იღებს განახლებულ მონაცემებს

    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, stock = $3, description = $4, slug = $5, category = $6 WHERE id = $7 RETURNING *",
      [name, price, stock, description, slug, category, id]
    );

    // თუ rowCount === 0 ნიშნავს რომ არ მოიძებნა პროდუქტი ამ id-ით
    if (result.rowCount === 0) {
      res.status(404).json({ err: "Product not found" });
    }

    // წარმატებით განახლების შემთხვევაში აბრუნებს განახლებულ პროდუქტს
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
}
export { getProducts, getOneProduct, createProduct, updateProduct };
