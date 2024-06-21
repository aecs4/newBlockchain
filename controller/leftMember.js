const leftMember=require("../Schema/admin")
const bcrypt=require("bcrypt")
exports.leftMember_Controller=async (req,res)=>{
  //  const{ 
  //          email,password
  //         }=req.body
    // const user_mail=req.user.email
   const {id,email}=req.body
   console.log("id",id)
    try{ 
        const data=await leftMember.findOne({email:email,"docHash.id":id},{
            'docHash.$' : 1
    })
        //  console.log("data",data)
         
        if(!data){
            res.status(401).send({status:false,message:"id don't match"})
        }else{
                console.log("data",data.docHash[0].Temprary)
                res.status(200).send({status:true,leftMember:data.docHash[0].Temprary,totalmembers:data.docHash[0].Members
                })
               
              }
        }
    catch(err){
        console.log(err);
        res.status(500).json({status:false,message:err.message})
    }


}
