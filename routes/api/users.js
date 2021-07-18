const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
// https://express-validator.github.io/docs/check-api.html
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

// @route POST api/users
// @desc  register user
// @access Public

router.get("/", (req, res) => res.send("user Route"));

router.post(
  "/",
  [check("name", "name is required").not().isEmpty()],
  [check("email", "please include valid empty").isEmail()],
  [
    check("password", "please include valid password of length 6").isLength({
      min: 6,
    }),
  ],
  [check("balance", "is number").isNumeric()],
  async (req, res) => {
    // define the errors object
    // https://express-validator.github.io/docs/validation-result-api.html
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // if errors object is not empty, return it in a array form
      return res.status(400).json({ errors: errors.array() });
    }

    // see if user exists

    const { name, email, password, balance } = req.body; // destructure

    try {
      // check if user already exists
      let user = await User.findOne({ email });

      if (user) {
        // user you are trying to registers already in DB
        // you cant make another registration of the same type
        res.status(400).json({ errors: [{ msg: "user already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
        balance,
      });

      const salt = await bcrypt.genSalt(10); // genSalt (n) n => rounds, more rounds better but slower
      user.password = await bcrypt.hash(password, salt); // encrypt the password

      await user.save();

      res.send("user registered");
    } catch (err) {
      // err is an object
      console.error(err.message);
      res.status(500).send("server error");
    }

    // encrypt the password
    // return jsonwebtoken (to be logged in immediately we need them to get a token)
  }
);

module.exports = router;
