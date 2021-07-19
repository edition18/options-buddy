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
    required: true,
    default: 0, //note the use of the default property
  },
});
let User; // defining this so Jest doesn't complain
module.exports = User = mongoose.model("user", UserSchema); // we also set this as a model within mongoose for access later
