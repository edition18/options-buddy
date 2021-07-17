const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, //note the use of the default property
  },
  balance: {
    type: Number,
    default: 0, //note the use of the default property
  },
});

module.exports = User = mongoose.model("user", UserSchema);
