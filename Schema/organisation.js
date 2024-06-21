const mongoose = require("mongoose");
const dataSchema = mongoose.Schema(
   {
    userID: {
      type: mongoose.Schema.Types.ObjectId,ref:"admin",
      unique: true
   }, 
   blockchainID: {
    type: mongoose.Schema.Types.ObjectId,ref:"blockchain",
    unique: true
 }, 

   },
   { timestamps: true, collection: 'users' }
);
// pre-save function to hash password
dataSchema.pre("save", function (next) {
    var user = this;
    if (user.isModified("password")) {
      bcrypt.genSalt(salt, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) return next(err);
          user.password = hash;
          user.password2 = hash;
          next();
        });
      });
    } else {
      next();
    }
  });
  // compare password
  dataSchema.methods.comparepassword = function (password, cb) {
     var user = this;
     // let a = bcrypt.hash(password,10)
    bcrypt.compare(password, user.password, function (err, isMatch) {
     // console.log(password, user.password, a, "HIIIIIII")
      if (err) return cb(next);
      cb(null, isMatch);
    });
  };
  // generate token
  dataSchema.methods.generateToken = function (cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), process.env.SECRET);
    user.token = token;
    user.save(function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  };
  // find by token
  dataSchema.statics.findByToken = function (token, cb) {
    var user = this;
    jwt.verify(token, process.env.SECRET, function (err, decode) {
      user.findOne({ _id: decode, token: token }, function (err, user) {
        if (err) return cb(err);
        cb(null, user);
      });
    });
  };
  //delete token
  dataSchema.methods.deleteToken = function (token, cb) {
    var user = this;
    user.update({ $unset: { token: 1 } }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  };
  module.exports = mongoose.model("data",dataSchema);