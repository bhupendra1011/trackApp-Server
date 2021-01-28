const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

//method to compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;

  return new Promise((resolve, reject) => {
    // comparing typed password with salted and hashed password
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (!isMatch || err) return reject(err);
      return resolve(true);
    });
  });
};

mongoose.model("User", userSchema);
