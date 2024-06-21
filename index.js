const express = require("express");
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
const mongoose = require("mongoose");
const router = require("./routers/router");


// const createBlockchainuser = require("./routers/createBlockchainuser");
require("dotenv").config();
const cors = require('cors');
// app.use(express.json)
const corsOptions ={
    origin:'http://localhost:3001', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(express.json());

app.use("/data", router);

app.listen(3000, () => {
  console.log("connecting to server"),
    mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => console.log("db_is_connected"))
      .catch((err) =>
        console.log("db_not_connceted" + process.env.DATABASE_URL)
      );
});
