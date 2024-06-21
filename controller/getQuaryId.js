const quary_schema = require("../Schema/admin");

exports.quary_controller = async (req, res) => {
  const { id,email } = req.body;
  console.log(typeof id)
  try {
    const data=await quary_schema.findOne({email:email,"docHash.id":id},{
        'docHash.$' : 1
})
    
console.log("data",data)
    if (!data) {
      res.status(401).send({ status: false, message: "id not match" });
    } else {
        console.log("Id match successfully");
        res.status(200).json({ massage: "id match successfully"});
      }
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err.message });
  }
};
