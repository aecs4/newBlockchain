const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Members_schema=require("../Schema/admin")
const nodemailer_controller = async (req, res) => {
  try {
        const{id,receiver,massage}=req.body
        const sender=req.user.email

        // const Members_update = await Members_schema.updateOne(
        //   { docHash: { $elemMatch: { id: mongoose.Types.ObjectId(id) } } },
        //   {
        //     $push: {
        //       "docHash.$.Members":[receiver,sender],
        //       // "docHash.$.timestamps": new Date().toLocaleString(),
        //     },
        //   }
        // );

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "yadavjaiyadav445@gmail.com",
        pass: "vfhpazitwxcexvkt",
      },
    });

    
    let mailOptions = {
      from: sender,
      to: receiver,
      subject: "Test Email",
      text: massage,
      html: `<b>Hello world?</b><br>http://localhost:3001/welcomescreen?id=${id}&email=${sender}>Click here for more information`
    };

    
    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
        res.status(404).json({
            status: false,
            message:("email send failed:" + error)

          });
      } else {
        console.log("Email sent: " + info.response);

        const expirationTimeInMinutes = 10;

// generate a random OTP
const otp = Math.floor(100000 + Math.random() * 900000);

// get current timestamp and calculate expiration time
const currentTimeStamp = new Date().getTime();
const expirationTimeStamp = currentTimeStamp + expirationTimeInMinutes * 60 * 1000;

// send mail with defined transport object
let info2 = await transporter.sendMail({
  from:sender, // sender address
  to: sender, // list of receivers
  subject: "Your One-Time Password", // Subject line
  text: `Your OTP is ${otp}. It will expire on ${new Date(expirationTimeStamp)}.`, // plain text body with expiration time
});
    
const transctionhash_update = await Members_schema.updateOne(
  { docHash: { $elemMatch: { id: mongoose.Types.ObjectId(id) } } },
  {
    $set: {
      "docHash.$.otp": otp,
      "docHash.$.expireTime":expirationTimeStamp,
      "docHash.$.Members":[receiver,sender],
    },
  }
);



console.log("Message sent: %s", info2.messageId);

        res.status(200).json({
            status: true,
            message:"email send successfully"
          });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("email send failed:" + error);
  }
};

module.exports = nodemailer_controller;
