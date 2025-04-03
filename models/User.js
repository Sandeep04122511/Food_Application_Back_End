const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user: String,
  email: { type: String, required: true, unique: true },
  password: String,
  phone: String,
  address: String,
});

module.exports = mongoose.model("User", UserSchema);
