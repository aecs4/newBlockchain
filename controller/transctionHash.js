const mongoose = require("mongoose");
const transctionHash_Schema = require("../Schema/admin");
let counter = 740435;
const transctionHash_controller = async (req, res) => {
  try {
    const { id, transctionHash } = req.body;
    const email = req.user.email;
    console.log(id);
    
function generateNumberInSeries(counter) {
  const number = counter;
  
  return number;
}
const contractnumber = generateNumberInSeries(counter);
console.log("contractnumber",contractnumber);
counter++;
    const transctionhash_update = await transctionHash_Schema.updateOne(
      { docHash: { $elemMatch: { id: mongoose.Types.ObjectId(id) } } },
      {
        $set: {
          "docHash.$.transctionHash": transctionHash,
          "docHash.$.contractnumber": contractnumber,
          "docHash.$.timestamps": new Date().toLocaleString(),
        },
      }
    );
    if (!transctionhash_update) {
      console.log("transctionHash update failed");
    } else {
      console.log("transctionhash_update", transctionhash_update);
      res.status(200).json({
        status: true,
        message: "your contract created succefully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error for uploding transctionHash", error);
  }
};

module.exports = transctionHash_controller;
