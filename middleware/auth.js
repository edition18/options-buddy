const jwt = require("jsonwebtoken");
const config = require("config");

// as a middleware
// it will take a req
// it will return a response
// next is a callback so that it moves to the next middleware

module.exports = function (req, res, next) {
  //get token from header
  const token = req.header("x-auth-token");
  if (!token) {
    // if no token
    return res.status(401).json({
      msg: "no token, auth denied",
    });
  }

  // token exists, verify
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // we need the secret to decode the token
    req.user = decoded.user;
    // set the req.user (i.e requesting user) to decoded user
    next();
  } catch (err) {
    res.status(401).json({
      msg: "token is not valid",
    });
  }
};
