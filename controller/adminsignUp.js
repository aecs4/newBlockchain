const admin_schema = require("../Schema/admin");
const jwt = require('jsonwebtoken');
exports.adminSignUP_controller = async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;

  try {
    if (confirmPassword != password) {
      res.status(401).send({
        status: false,
        message: "Comfirm password and Password don't match",
      });
      return;
    } else {
      const userExist = await admin_schema.findOne({ email: email });
      if (userExist) {
        res.status(409).send({ status: false, message: "User already exist" });
        return;
      }
      // const hashPassword=await bcrypt.hash(password,12)
      const newCreatedUser = await admin_schema.create({
        userName,
        email,
        password,
        walletAddress:null,
        walletPassword:null,
      });
      const newUser = await newCreatedUser.save();
       // Generate JWT token
       const token = jwt.sign(
        { id: newCreatedUser._id, email: newCreatedUser.email },
        process.env.TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      console.log("token",token)
      res.status(200).json({ status: true, token:token,result:"adminCreate" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err.message });
  }
};
