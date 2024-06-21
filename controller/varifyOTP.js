const otp_schema = require("../Schema/admin");


exports.OTP_controller = async (req, res) => {
  const { id,otp,email } = req.body;
  // console.log("data",req.body)
  // const user_mail=req.user.email
  try {
    const data=await otp_schema.findOne({email:email,"docHash.id":id},{
        'docHash.$' : 1
})
    //  console.log("data",data.docHash[0].otp)
    if (!data) {
      res.status(401).send({ status: false, message: "data not found" });
    } else {
    //   const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
    if (data.docHash[0].expireTime < new Date().getTime() ) {
        console.log("otp expire");
    
       
        res.status(400).json({ massage: "otp expire"});
      }
        // Generate JWT token
       else{
        if(data.docHash[0].otp==otp){

          const result=await otp_schema.updateOne({email:email,"docHash.id":id},{
            $unset: {
                "docHash.$.otp": "",
                "docHash.$.expireTime":"",
              },  
    })
    // console.log("OTP record deleted successfully with deletedCount:", result.deletedCount);

    res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Length', data.docHash[0].file_buffer[0].length);
    // res.setHeader('Content-Disposition', 'inline; filename="example.pdf"');
          // console.log("file_buffer",data.docHash[0].file_buffer)
          res.status(200).json({ User:"2",buffer:data.docHash[0].file_buffer});
        }else{
          res.status(400).json({ massage: "otp incorrect"});
        }
       
       }
        
      }
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err.message });
  }
};
