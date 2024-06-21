const userDETAILS=require("../Schema/admin")
const bcrypt=require("bcrypt")
exports.user_controller=async (req,res)=>{
  //  const{ 
  //          email,password
  //         }=req.body
   const user_mail=req.user.email
//    const user=req.user
//    console.log("userDetails",user)
    try{ console.log("user",user_mail)
        const data=await userDETAILS.findOne({email:user_mail})
        if(!data){
            res.status(401).send({status:false,message:"email don't match"})
        }else{
                // console.log("data",data.docHash)
                res.status(200).send({status:true,message:{userName:data.userName,email:data.email,walletAddress:data.walletAddress,total_contract:data.docHash.length},contracts:{contracts_details:data.docHash}
                })
               
              }
        }
    catch(err){
        console.log(err);
        res.status(500).json({status:false,message:err.message})
    }


}
