const blockchainSchema= require("../Schema/admin");

const Create_blockchain_User_controller = async (req, res) => {
  const {walletPassword} = req.body;
  console.log("walletPassword",walletPassword)
  const email=req.user.email
  console.log("email",email)
  // const { email } = req.query;
  try {
  
    const walletAddress="0xdc563c93ca29941747f44182469f90c1ac170be6"
    const owner_password="12345678"
    async function createNewAddress(passphrase) {
      if (passphrase?.length==6) {
        const Web3 = require('web3');
  const { spawn } = require('child_process');
  const web3 = new Web3('http://127.0.0.1:8000');
    const geth = spawn('geth', ['attach']); // Replace with the path to your geth executable
    geth.stdout.on('data', async (data) => {
      const output = data.toString();
      if (output.includes('Welcome to the Geth JavaScript console')) {

        const Newaddress = await web3.eth.personal.newAccount(passphrase);
        console.log("Newaddress",Newaddress);
        const unlock = await web3.eth.personal.unlockAccount(walletAddress,owner_password);
        console.log("unlock",unlock);
        const transfer = await web3.eth.sendTransaction({from:walletAddress, to:Newaddress, value:10000000000000000})
        if(!transfer){
          console.log("tranferfaild")
        }else(
        console.log("transfer",transfer));
        geth.stdin.write('exit\n');
        
        const blockchain_detailed = await blockchainSchema.updateOne(
          { email:email}, 
          {$set: {walletPassword:walletPassword,
                  walletAddress:Newaddress}
                    },
          )
        res.status(200).json({
          status: true,
          message:{walletAddress:Newaddress,
            walletPassword:walletPassword }
        });
      }
    });
    // geth.stdin.write('console.log("Welcome to the Geth JavaScript console");\n');
  }
  
  else {console.log("password should be 6 letter")
        res.status(404).json({
          status: false,
          message: "password should be 6 letter",
        });
      }}
    
    
  

    createNewAddress(walletPassword);
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = Create_blockchain_User_controller;
