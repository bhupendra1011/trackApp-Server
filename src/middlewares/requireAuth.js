const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === 'Bearer jsjdjsasdjdd'
  if (!authorization) {
    return res.status(401).send({ error: "You need to sign in !" });
  }
  const token = authorization.replace("Bearer", "").trim();
  jwt.verify(token, "MY_SECRET_KEY", async (error, payload) => {
    if (error) {
      console.log(error.message);
      return res.status(401).send({ error: "You need to sign in !" });
    }
    // read user info form mongoDB collection from userid enctypted in JWT token
    const user = await User.findById(payload.userId);
    req.user = user;
    next();
  });
};
