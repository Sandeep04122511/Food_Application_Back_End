const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  restaurant: String,
});

module.exports = mongoose.model("Food", FoodSchema);
