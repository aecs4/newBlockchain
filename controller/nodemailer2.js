const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Members_schema = require("../Schema/admin");
const CryptoJS = require("crypto-js");
const nodemailer2_controller = async (req, res) => {
  try {
    const {
      id,
      receiver,
      cid,
      transctionHash,
      Parties,
      leftParties,
      firstUser,
    } = req.body;
    const sender = req.user.email;
    console.log("cid", cid, "transctionHash", transctionHash,"receiver",receiver);
    let filteredDocHash;

    if (firstUser) {
      const Members_update = await Members_schema.updateOne(
        { docHash: { $elemMatch: { id: mongoose.Types.ObjectId(id) } } },
        {
          $set: {
            "docHash.$.Members": Parties,
            "docHash.$.Temprary": Parties,
          },
        }
      );

      if (!Members_update) {
        console.log("Members_update failed");
      } else {
        console.log("Members_update", Members_update);
      }
    } else {
      const Members_update = await Members_schema.updateOne(
        { docHash: { $elemMatch: { id: mongoose.Types.ObjectId(id) } } },
        {
          $set: {
            "docHash.$.Members": Parties,
            "docHash.$.Temprary": leftParties,
          },
        }
      );

      if (!Members_update) {
        console.log("Members_update failed");
      } else {
        console.log("Members_update", Members_update);
      }
    }

    const dochash = await Members_schema.findOne(
      { email: sender, "docHash.id": id },
      {
        "docHash.$": 1,
      }
    );
    //  console.log("data",data)

    if (!dochash) {
      res
        .status(401)
        .send({ status: false, message: "docHash member not get" });
      console.log("docHash member not get");
    } else {
      filteredDocHash = dochash.docHash[0];
      console.log("receiver",receiver)
      // console.log("filteredDocHash",filteredDocHash)
      // console.log("dochashMember", dochash.docHash);
      console.log("dochashMember",filteredDocHash.Temprary);
    }
    // const Members = dochash.Members;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "yadavjaiyadav445@gmail.com",
        pass: "vfhpazitwxcexvkt",
      },
    });

    const secretKey = 'appzotech-digital-signature-application';
    const queryString = `id=${id}&email=${sender}`;
    console.log("queryString",queryString )
    const encryptedQueryString = CryptoJS.AES.encrypt(queryString, secretKey).toString();
    console.log("encryptedQueryString",encryptedQueryString);
    const encryptedURL = `http://localhost:3001/welcomescreen?query=${encodeURIComponent(encryptedQueryString)}`;

console.log("encryptedURL",encryptedURL);
    // let mailOptions = {
    //   from: sender,
    //   to:recipients.join(","),
    //   subject: "Test Email",
    // //   text:cid,transctionHash,

    //   html: `<p>your cid code is <span class="cid">https://ipfs.io/ipfs/${cid}?filename=${cid}</span> and your transctionHash is <span class="transctionHash">${transctionHash}</span></p>`
    // };

    // console.log("mailOptions",mailOptions)

    // transporter.sendMail(mailOptions, async function (error, info) {
    //   if (error) {
    //     console.log(error);
    //     res.status(404).json({
    //         status: false,
    //         message:("email send failed:" + error)

    //       });
    //   } else {
    //     console.log("Email sent: " + info.response);
    //     res.status(200).json({
    //         status: true,
    //         message:"email send successfully"
    //       });
    //   }
    // });

    async function sendIPFSLinkEmail(encryptedURL, receiver) {
      try {
        const mailOptions = {
          from: sender,
          to: receiver,
          subject: "Document Signature Request",
          html: `<b>Hello world?</b><br>${encryptedURL}>Click here for more information`,
        };

        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(error);
            res.status(404).json({
              status: false,
              message: "email send failed:" + error,
            });
          } else {
            console.log("Email sent: " + info.response);

            const expirationTimeInMinutes = 10;

            // generate a random OTP
            const otp = Math.floor(100000 + Math.random() * 900000);

            // get current timestamp and calculate expiration time
            const currentTimeStamp = new Date().getTime();
            const expirationTimeStamp =
              currentTimeStamp + expirationTimeInMinutes * 60 * 1000;

            // send mail with defined transport object
            let info2 = await transporter.sendMail({
              from: sender, // sender address
              to: sender, // list of receivers
              subject: "Your One-Time Password", // Subject line
              text: `Your OTP is ${otp}. It will expire on ${new Date(
                expirationTimeStamp
              )}.`, // plain text body with expiration time
            });

            const transctionhash_update = await Members_schema.updateOne(
              { docHash: { $elemMatch: { id: mongoose.Types.ObjectId(id) } } },
              {
                $set: {
                  "docHash.$.otp": otp,
                  "docHash.$.expireTime": expirationTimeStamp,
                  // "docHash.$.Members":[receiver,sender],
                },
              }
            );

            console.log("Message sent: %s", info2.messageId);

            // res.status(200).json({
            //     status: true,
            //     message:"email send successfully"
            //   });
          }
        });
      } catch (error) {
        console.error(
          `Error sending IPFS link email from ${sender} to ${receiver}:`,
          error
        );
      }
    }

    // Function to send an email with transaction hash
    async function sendTransactionHashEmail(
      sender,
      receiver,
      transctionHash,
      cid
    ) {
      try {
        const mailOptions = {
          from: sender,
          to: receiver.join(","),
          subject: "Document Signature Complete",
          html: `<p>your cid code is <span class="cid">https://ipfs.io/ipfs/${cid}?filename=${cid}</span> and your transctionHash is <span class="transctionHash">${transctionHash}</span></p>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(
          `Transaction hash email sent from ${sender} to all users:`,
          info.messageId
        );
      } catch (error) {
        console.error(
          `Error sending transaction hash email from ${sender} to all users:`,
          error
        );
      }
    }

    console.log(
      "dochash.docHash[0].Temprary.length ",
      filteredDocHash.Temprary,
      filteredDocHash.Temprary.length
    );
    if (filteredDocHash.Temprary.length >1 ) {
      sendIPFSLinkEmail(encryptedURL,receiver);
      const delete_temprary = await Members_schema.updateOne(
        { docHash: { $elemMatch: { id: mongoose.Types.ObjectId(id) } } },
        { $pop: { "docHash.$.Temprary": -1 } }
        //       { new: true }, // Options: return the updated document
        //   (error, Document) => {
        //     if (error) {
        //       console.error('Error updating the document:', error);
        //     } else {
        //       console.log("uplode sussefully");
        //       console.log("docHash[0].Temprary.length", Document.docHash);
        //       // res.status(200).json({
        //       //   status: true,
        //       //   message: "sendIPFSLinkEmail",
        //       // })
        // } }
      );
      if (delete_temprary.modifiedCount === 1) {
        console.log("Update successful");
        console.log("update-Temprary", delete_temprary);
        res.status(200).json({
          status: true,
          message: "sendIPFSLinkEmail",
        });
      } else {
        console.log("No documents were modified");
      }
    } else {
      sendTransactionHashEmail(sender, receiver, transctionHash, cid);
      res.status(200).json({
        status: true,
        message: "sendTransactionHashEmail",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("email send failed:" + error);
  }
};

module.exports = nodemailer2_controller;
