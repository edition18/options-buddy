const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
// https://express-validator.github.io/docs/check-api.html

// @route POST api/users
// @desc  register user
// @access Public

router.post(
  "/",
  [check("name", "name is required").not().isEmpty()],
  [check("email", "please include valid empty").isEmail()],
  [
    check("password", "please include valid password of length 6").isLength({
      min: 6,
    }),
  ],
  (req, res) => {
    // define the errors object
    // https://express-validator.github.io/docs/validation-result-api.html
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // if errors object is not empty, return it in a array form
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    res.send("user route");
  }
);

module.exports = router;
