const userDETAILS=require("../Schema/admin")
const bcrypt=require("bcrypt")
exports.userHash=async (req,res)=>{
  //  const{ 
  //          email,password
  //         }=req.body
    const user_mail=req.user.email
   const {id}=req.body
   console.log("id",id)
    try{ 
        const data=await userDETAILS.findOne({email:user_mail,"docHash.id":id},{
            'docHash.$' : 1
    })
        //  console.log("data",data)
         
        if(!data){
            res.status(401).send({status:false,message:"id don't match"})
        }else{
                console.log("data",data.docHash)
                res.status(200).send({status:true,message:data.docHash
                })
               
              }
        }
    catch(err){
        console.log(err);
        res.status(500).json({status:false,message:err.message})
    }


}
