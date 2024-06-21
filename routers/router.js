const express = require("express");
const multer = require("multer");
const upload = multer();
// const http=require("../config/certs")
const fs = require('fs')
const { Client } = require('@elastic/elasticsearch');
// const https = require('https');
const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: 't-hCZpeiIz_IeplPYNe9'
  },
  // ssl: {
  //   ca: fs.readFileSync('config/certs/http_ca.crt')
  // }
});
const signUp_controller = require("../controller/adminsignUp");
const LOgin_controller = require("../controller/adminLogin");
const createBlockchainUser = require("../controller/createBlockchainUser");
const unlock_Account_controller = require("../controller/unlockAccount");
const Ipfs_controller = require("../controller/ipfs_uplode");
const get_controller = require("../controller/userDocHashList");
const nodemailer_controller = require("../controller/nodemailer");
const transctionHash_controller=require("../controller/transctionHash")
const userHash=require("../controller/userSingleHash")
const OTP_controller=require("../controller/varifyOTP")
const nodemailer2_controller=require("../controller/nodemailer2")
const quary_controller=require("../controller/getQuaryId")
const member_Controller=require("../controller/contractorDetail")
const leftMember_Controller=require("../controller/leftMember")


const router = express.Router();

// const upload = multer({ 
//   storage: multer.memoryStorage(), // use memory storage
//   limits: { fileSize: 10 * 1024 * 1024 } // set maximum file size to 10MB
// });
// Import required packages
const jwt = require("jsonwebtoken");


// Secret key to sign JWT tokens
// const secretKey = 'mySecretKey';

// // Generate JWT token
// const generateToken = (user) => {
//   const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
//   return token;
// };

// Middleware to extract user details from JWT token
const authMiddleware =async (req, res, next) => {
  
  try {
    let token = req.headers.authorization;
     console.log("token", token);
    if (token) {
      token = token.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      // const { id, email } = decodedToken;
      req.user = {
        id: decodedToken.id,
        email: decodedToken.email,
      };

      // const { body } = await client.search({
      //   index: 'your_index_name', // Replace with the name of your Elasticsearch index
      //   body: {
      //     query: {
      //       bool: {
      //         must: [
      //           { match: { id: id } },
      //           { match: { email: email } }
      //         ]
      //       }
      //     }
      //   }
      // });
      // if (body.hits.total.value === 0) {
      //   res.status(404).json({ message: "ethersearch Error" });
      // } else {
      //   req.user = {
      //     id: decodedToken.id,
      //     email: decodedToken.email,
      //   };}



      next();
    } else {
      res.status(401).json({ message: "unautherized token" });
    }
   
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const storeReqDataMiddleware = async (req, res, next) => {
  try {
    const indexName = 'userInfo'; // Replace with the name of your Elasticsearch index

    const reqData = {
      user: req.user,
      timestamp: new Date(),
      path: req.path,
      method: req.method,
      body: req.body,
      // Include any other relevant req data you want to store
    };
   console.log("elasticsearch_reqData",reqData)
      
   const response = await client.index({
      index: indexName,
      body: reqData,
    });
    console.log("response",response)
    next();
  } catch (error) {
    console.error('Failed to store req data in Elasticsearch:', error);
  }
};

const getReqDataMiddleware = async (req, res, next) => {
  try {
    const indexName = 'userInfo'; // Replace with the name of your Elasticsearch index

    const { body } = await client.search({
      index: indexName,
      body: {
        query: {
          bool: {
            must: [
              { match: { 'user.id': req.user.id } },
              { match: { 'user.email': req.user.email } },
            ],
          },
        },
      },
    });

    if (body.hits.total.value === 0) {
      // No req data found
      req.reqData = null;
      res.status(200).json({ message:req.reqData});
    } else {
      // Retrieve the latest req data
      const sortedHits = body.hits.hits.sort((a, b) => {
        return new Date(b._source.timestamp) - new Date(a._source.timestamp);
      });

      req.reqData = sortedHits[0]._source;
      res.status(200).json({ message:req.reqData});
    }
    
    next();


  } catch (error) {
    console.error('Failed to retrieve req data from Elasticsearch:', error);
   
  }
};

// Example usage of generateToken function
// const user = { id: 1, email: 'example@gmail.com' };
// const token = generateToken(user);
// console.log(token); // Output: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJleGFtcGxlQGdtYWlsLmNvbSIsImlhdCI6MTYyMjI5NTE2MSwiZXhwIjoxNjIyMjk4NzYxfQ.5J_iZuDB7pFTo_ysKjJ_C0hmUeY6UJy08iZAPCN2BU0

// // Example usage of authMiddleware middleware
// app.get('/protected-route', authMiddleware, (req, res) => {
//   res.json({ message: 'Hello, ' + req.user.email });
// });

router.post("/leftmember", authMiddleware, (req, res) => {
  leftMember_Controller.leftMember_Controller(req, res);
});

router.post("/userinfo",authMiddleware,getReqDataMiddleware)


router.post("/members",authMiddleware,(req, res) => {
  member_Controller(req, res);
});

router.post("/query",(req, res) => {
  quary_controller.quary_controller(req, res);
});

router.post("/mail",authMiddleware,(req, res) => {
  nodemailer2_controller(req, res);
});

router.post("/otp",(req, res) => {
  OTP_controller.OTP_controller(req, res);
});

router.post("/transctionHash",authMiddleware,(req, res) => {
  transctionHash_controller(req, res);
});

router.post("/docHash",authMiddleware,(req, res) => {
  userHash.userHash(req, res);
});

router.post("/get_data", authMiddleware, (req, res) => {
  get_controller.user_controller(req, res);
});

router.post("/signUp", (req, res) => {
  signUp_controller.adminSignUP_controller(req, res);
});

router.post("/logIn", (req, res) => {
  LOgin_controller.adminLogin_controller(req, res);
});

router.post("/createBlockchain", authMiddleware, (req, res) => {
  createBlockchainUser(req, res);
});

router.post(
  "/uploadImage",
  upload.single("pdf"),
  authMiddleware,
  (req, res) => {
    Ipfs_controller(req, res);
  }
);

router.post("/unlock", authMiddleware, (req, res) => {
  unlock_Account_controller(req, res);
});

router.post("/sendMail", authMiddleware, (req, res) => {
  nodemailer_controller(req, res);
});

module.exports = router;
