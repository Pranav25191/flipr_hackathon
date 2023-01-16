const moment = require("moment");
const router = require("express").Router();
const express = require("express");
const mongoose = require("mongoose");
const {companyCollection} = require("./../schemas/companyschema");
const {stockData} = require("./../schemas/stockschema");
const { response } = require("express");
const { type } = require("express/lib/response");
const app = express();
// const {checkAuth} = require("./../app")
app.use(express.static("public"));

const checkAuth = function (req, res, next) {
    console.log(req.user);
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

router.get("/:company",  checkAuth,(req, res) => {
      console.log("hiiiii");
      const get_data = async () => {
        if (req.params.company !== null) {
            const company_id = await companyCollection.findOne({ companyname : req.params.company });
            var currDateData =  await stockData.find({companyid: company_id["company_id"]});
            var data = [];
            for(let i=0;i<currDateData.length;i++){
                data.push({
                    "Date":currDateData[i]["timestamp"],
                    "Open":currDateData[i]["open"],
                    "High":currDateData[i]["high"],
                    "Low":currDateData[i]["low"],
                    "Close":currDateData[i]["close"],
                    "Volume":currDateData[i]["volume"]
                });
            }
            // console.log(company_id, currDate,currDateData);
            // var response = {
            //     "dayHigh":"",
            //     "dayLow":"",
            //     "52WeekHigh":"",
            //     "52WeekLow":"",
            //     "prevClose":"",
            //     "open":"",

            // };
            // console.log(data);
            res.status(200).send({result:data});
        }
      };
      get_data();

    } );

module.exports = router;