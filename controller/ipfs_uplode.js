const {create} = require('ipfs-http-client');
const Schema=require("../Schema/admin")
const mongoose = require("mongoose");
const ObjectID = require("bson-objectid");

// Create an IPFS client instance
const ipfs = create({ host: '127.0.0.1', port: '5001', protocol: 'http' });
const image_upload_controller =async(req, res) => {
  // console.log(req)
  try { const {buffer,originalname} = req.file;
        // const {id}=req.body;
        // console.log("typeof buffer",typeof buffer,buffer,"originalname",originalname)
        const email=req.user.email
        // console.log("file",req.file)
// Read the DOC file contents into a Buffer
const fileContents = Buffer.from(buffer);  // Replace 'hello world' with your DOC file contents
    //  console.log("fileContents",fileContents)
// Add the file to IPFS
 ipfs.add(fileContents).then(async result => {
  console.log(result.path); // Print the IPFS hash of the uploaded file
const id =ObjectID().toHexString()
 console.log("idddddddd",typeof id,id)
// const id2=ObjectID.createFromHexString()
// console.log("idddddddd",id2)
  const blockchain_detailed =Schema.findOneAndUpdate(
    { email: email}, // Filter
    {$push: {docHash:{fileName:originalname,hash:result.path,file_buffer:buffer,id:id} } }, // Update
    { new: true }, // Options: return the updated document
    (error, updatedDocument) => {
      if (error) {
        console.error('Error updating the document:', error);
      } else {
        console.log("uplode sussefully");
  } })
  
  // const transctionhash_update = await Schema.updateOne(
  //   { docHash: { $elemMatch: { id: mongoose.Types.ObjectId(id) } } },
  //   {
  //     $set: {
  //       "docHash.$.fileName": originalname,
  //       "docHash.$.hash": result.path,
  //       "docHash.$.id": id,
  //       // "docHash.$.file_buffer":buffer,
  //     },
  //   }
  // );

  // await Schema.updateOne(
  //   { email: email}, 
  //   {$push: {docHash:{fileName:originalname,hash:result.path}},
  //    },
  //   )
  //  console.log("blockchain_detailed",blockchain_detailed)
  res.status(200).json({
    status: true,
    cid:result.path,
    filename:originalname,
    id:id,
    file_buffer:buffer
  });
})}catch (error) {
  console.error(error);
  res.status(500).send('Error uploading image to IPFS',error);
}
}

module.exports = image_upload_controller;

