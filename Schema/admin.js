const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const adminSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    walletAddress: {
      type: String,
      //  unique: true
    },
    docHash: [
      { id:String,
        contractnumber:String,
        fileName: String,
        Members:Array,
        Temprary:Array,
        file_buffer:Buffer,
        hash: String,
        transctionHash:String,
        timestamps: String,
        otp:Number,
        expireTime:String
        // unique: true
      },
    ],

    walletPassword: {
      type: String,
      //  unique: false
    },
    // token: {
    //   type: String,
    // }
  },
  { timestamps: true, collection: "users" }
);
// pre-save function to hash password
adminSchema.pre("save", function (next) {
  var admin = this;
  if (admin.isModified("password")) {
    // const salt =10;
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(admin.password, salt, function (err, hash) {
        if (err) return next(err);
        admin.password = hash;
        // admin.password2 = hash;
        next();
      });
    });
  } else {
    next();
  }
});
// compare password
adminSchema.methods.comparepassword = function (password, cb) {
  var user = this;
  // let a = bcrypt.hash(password,10)
  bcrypt.compare(password, admin.password, function (err, isMatch) {
    // console.log(password, user.password, a, "HIIIIIII")
    if (err) return cb(next);
    cb(null, isMatch);
  });
};
// generate token
// adminSchema.methods.generateToken = function (cb) {
//   var admin = this;
//   var token = jwt.sign(admin._id.toHexString(), process.env.SECRET);
//   admin.token = token;
//   admin.save(function (err, user) {
//     if (err) return cb(err);
//     cb(null, user);
//   });
// };
// find by token
adminSchema.statics.findByToken = function (token, cb) {
  var admin = this;
  jwt.verify(token, process.env.SECRET, function (err, decode) {
    admin.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};
//delete token
adminSchema.methods.deleteToken = function (token, cb) {
  var admin = this;
  admin.update({ $unset: { token: 1 } }, function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};
module.exports = mongoose.model("admin", adminSchema);
