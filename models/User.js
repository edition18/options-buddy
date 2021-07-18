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

// eslint-disable-next-line no-undef
module.exports = User = mongoose.model("user", UserSchema);
