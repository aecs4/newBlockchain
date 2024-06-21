const unlock_Account_controller = async (req, res) => {
  const {walletPassword,walletAddress} = req.body;
  try{
  const Web3 = require('web3');
  const { spawn } = require('child_process');
  const web3 = new Web3('http://127.0.0.1:8000');
  const unlockAccount = async (address, password) => {
    const geth = spawn('geth', ['attach']); // Replace with the path to your geth executable
    geth.stdout.on('data', async (data) => {
      const output = data.toString();
      if (output.includes('Welcome to the Geth JavaScript console')) {
        const result = await web3.eth.personal.unlockAccount(address, password, 0);
        console.log(result);
       
        geth.stdin.write('exit\n');
        
        res.status(200).json({
          status: true,
          message:"log in successfully"
        });
      }
    });
    // geth.stdin.write('console.log("Welcome to the Geth JavaScript console");\n');
  };
  unlockAccount(walletAddress,walletPassword);}
  catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err.message });
  }
}
  module.exports = unlock_Account_controller;