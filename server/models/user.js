const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
  },
  { collection: "users" }
);

module.exports = model("User", userSchema);
