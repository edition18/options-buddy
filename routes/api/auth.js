const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
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

module.exports = router;
