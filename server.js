const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// เชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "myproduct-bee"  // ชื่อฐานข้อมูลที่ถูกต้อง
});

// ตรวจสอบการเชื่อมต่อ
db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database");
});

// 📌 ดึงข้อมูลสินค้า (GET)
app.get("/product-bee", (req, res) => {
    db.query("SELECT * FROM `product-bee`", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// 📌 เพิ่มสินค้าใหม่ (POST)
app.post("/product-bee/create", (req, res) => {
    const { product_name, product_price, product_cost, product_image } = req.body;
    
    if (!product_name || !product_price || !product_cost || !product_image) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "INSERT INTO `product-bee` (product_name, product_price, product_cost, product_image) VALUES (?, ?, ?, ?)";
    db.query(sql, [product_name, product_price, product_cost, product_image], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Product added successfully", id: result.insertId });
    });
});

// 📌 แก้ไขข้อมูลสินค้า (PUT)
app.put("/product-bee/update/:id", (req, res) => {
    const { product_name, product_price, product_cost, product_image } = req.body;
    const { id } = req.params;

    if (!product_name || !product_price || !product_cost || !product_image) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "UPDATE `product-bee` SET product_name=?, product_price=?, product_cost=?, product_image=? WHERE id=?";
    db.query(sql, [product_name, product_price, product_cost, product_image, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Product updated successfully" });
    });
});

// 📌 ลบสินค้า (DELETE)
app.delete("/product-bee/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM `product-bee` WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Product deleted successfully" });
    });
});
    
// 📌 ตั้งค่าให้เซิร์ฟเวอร์รันที่พอร์ต 5000
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
