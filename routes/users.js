var express = require("express");
var router = express.Router();
let User = require("../models/User");
let token = require("../modules/config");
let { compare } = require("bcrypt");

/* register page */
router.get("/register", (req, res, next) => {
  res.render("registerForm");
});
//login page
router.get("/login", (req, res, next) => {
  res.render("loginForm");
});

// registering user
router.post("/register", async (req, res, next) => {
  console.log(req.body);
  try {
    let user = await User.create(req.body);
    let createdToken = await token.generateJwt(user);
    req.session.userId = createdToken;
    res.redirect("/");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// login user
router.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    let result = await compare(password, user.password);
    if (user && result) {
      let createdToken = await token.generateJwt(user);
      req.session.userId = createdToken;
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
});

function userInfo(user) {
  return {
    email: user.email,
    username: user.username,
  };
}

module.exports = router;
