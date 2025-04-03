const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Food = require("../models/Food");
const verifyAdmin = require("../middleware/auth");

const router = express.Router();

// 🔹 Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ error: "Admin not found!" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials!" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// 🔹 Add Food Item (Only Admin)
router.post("/add-food", verifyAdmin, async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.json({ message: "Food added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get All Food Items
router.get("/foods", async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

// 🔹 Update Food Item (Only Admin)
router.put("/update-food/:id", verifyAdmin, async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Delete Food Item (Only Admin)
router.delete("/delete-food/:id", verifyAdmin, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
