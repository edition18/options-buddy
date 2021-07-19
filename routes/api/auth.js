const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

// @route GET api/auth
// @desc  Test Route
// @access Public

// see that we added the auth middleware here to protect the route
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user); // return the user data in json example below:
    // {
    //     "balance": 0,
    //     "_id": "60f4edb4f6c85c3b004a7615",
    //     "name": "Test Person F",
    //     "email": "testpersonF@gmail.com",
    //     "date": "2021-07-19T03:12:52.670Z",
    //     "__v": 0
    // }
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

// @route POST api/auth
// @desc auth user and get token
// @access Public
router.post(
  "/",
  [
    check("email", "please include valild email").isEmail(),
    check("password", "pw required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req); // check if any of the 2 required fields are missing
    if (!errors.isEmpty()) {
      //if error output in array
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    //destructuring of valid values, since the input has already passed the validation check

    try {
      let user = await User.findOne({ email });
      // find the user in DB

      if (!user) {
        res.status(400).json({
          errors: [{ msg: "User doesnt exist!" }],
          // the above is a array of objects, with only 1 object with msg property
        });
      }

      //check if password matches with user.password (being the ENCRYPTED password stored in Mongo)
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({
          errors: [{ msg: "[PW] User doesnt exist!" }],
        });
      }

      const payload = {
        user: {
          id: user._id,
          // we could have used id instead, mongoose has an abstraction
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.send({ token });
          // send back token as a object
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json.send("Server Error");
    }
  }
);

module.exports = router;
