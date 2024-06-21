const admin_schema = require("../Schema/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.adminLogin_controller = async (req, res) => {
  console.log("req.body", req.body)
  const { email, password } = req.body;
  
  try {
    const data = await admin_schema.findOne({ email: email });
    
    // console.log("data",data.walletAddress)
    if (!data) {
      res.status(401).send({ status: false, message: "email not valid match" });
    } else {
      let submittedPass = password;
      let storedPass = data.password;

      const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
      if (!passwordMatch) {
        res
          .status(401)
          .send({ status: false, message: "password don't match" });
      } else {
        // Generate JWT token
        const token = jwt.sign(
          { id: data.id, email: data.email },
          process.env.TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        console.log("token", token);
        res.status(200).json({ massage: "logIn successfully", token: token,walletAddress:data.walletAddress});
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err.message });
  }
};
