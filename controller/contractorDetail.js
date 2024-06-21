const mongoose = require("mongoose");
const contractor_Schema = require("../Schema/admin");
const ObjectID = require("bson-objectid");
const member_Controller = async (req, res) => {
  try {
    const { Members,id} = req.body;
    const email = req.user.email;
    // const id =ObjectID().toHexString()
    // console.log("idddddddd",typeof id,id)
    // console.log(id);
    const member_update = await contractor_Schema.updateOne(
      { docHash: { $elemMatch: { id: mongoose.Types.ObjectId(id) } } },
      {
        $set: {
          "docHash.$.Members": Members,
          // "docHash.$.timestamps": new Date().toLocaleString(),
        },
      }
    );
    if (!member_update) {
      console.log("member_update  failed");
    } else {
      console.log("member_update", member_update);
      res.status(200).json({
        status: true,
        message: "member_update succefully",
      });
    }
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error for uploding transctionHash", error);
  }
};

module.exports = member_Controller;
