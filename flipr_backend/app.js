const express = require('express')

const mongoose = require("mongoose")
const jsonwebtoken = require('jsonwebtoken');
const {stockData} = require("./schemas/stockschema")
const {updateSchema} =  require("./utils/uploadcompanydata")
const {companyCollection} = require("./schemas/companyschema")
const {usermodel} = require('./schemas/userschema')
// const {userCollection} = require("./schemas/userSchema.js")
const {uploadStockData} =  require("./utils/uploadstockdata");
const metadata = require("./routes/initializeDatabase");
const historicalData = require("./routes/historicaldata");
const bodyParser = require('body-parser')
// const profile = require("./routes/profile");

const app = express();
var cors = require('cors');
app.use(cors());

const req = require('express/lib/request');
const port = 4444;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect("mongodb://0.0.0.0:27017/flipr_hackathon")
.then(
    () =>{
        console.log("Connected to MongoDB.....");
    }
)
.catch((err) => console.error("could not connect to mongo db", err));

app.use( function(req, res, next) {
    console.log(req.headers);
    console.log("herererere",req.headers.authorization)
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
       jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
  });



// app.use(
//     cors({
//       allowOrigin: "*",
//       credentials: true,
//     })
//   );

usermodel.createCollection((err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("User collection created!");
    }
});


// Create the time series collection
stockData.createCollection((err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Time series collection created!");
    }
});

app.use("/metadata", metadata);
app.use("/historicaldata", historicalData)
// app.use("/profile", profile);


// Create the time series collection
companyCollection.createCollection((err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("company collection created!");
    }
});


updateSchema();
uploadStockData();

const checkAuth = function (req, res, next) {
    try{
        if (!req.user){
            throw("User not logged in");
        }
        else{
            next();
        }
    }
    catch{
        res.status(401).send("User not logged in");
    }
        
}

module.exports = {checkAuth}

app.use(cors());
app.use(express.json());

app.get('/',checkAuth, (req, res) => {
  res.send('Home page of Mtech Application site!');
})

var userroute = require('./routes/profile');
userroute(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})