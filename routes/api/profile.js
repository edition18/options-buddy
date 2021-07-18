const express = require("express");
const router = express.Router();

// @route GET api/profile/me
// @desc  get current user profile
// @access Private (i.e. needs token)

router.get("/", (req, res) => res.send("profile route"));

module.exports = router;
