const moment = require("moment");
const router = require("express").Router();
const express = require("express");
const mongoose = require("mongoose");
const {companyCollection} = require("./../schemas/companyschema");
const {stockData} = require("./../schemas/stockschema");
const { response } = require("express");
const { type } = require("express/lib/response");
const app = express();
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


router.get("/:company", checkAuth, (req, res) => {
      const get_data = async () => {
        if (req.params.company !== null) {
            const company_id = await companyCollection.findOne({ companyname : req.params.company });
            var currDate = new Date("2023-01-12T00:00:00.000Z");
            var currDateData =  await stockData.findOne({companyid: company_id["company_id"], timestamp: currDate});
            console.log(company_id, currDate,currDateData);
            var response = {
                "dayHigh":"",
                "dayLow":"",
                "52WeekHigh":"",
                "52WeekLow":"",
                "prevClose":"",
                "open":"",

            };
            response["dayHigh"]=currDateData["high"];
            response["dayLow"] =currDateData["low"];
            response["open"] = currDateData["open"];
            response["currClose"]= currDateData["close"];

            var prevDate = new Date("2023-01-12T00:00:00.000Z");
            var newDate =currDate.setDate(currDate.getDate()-1);
            var currDateData =  await stockData.findOne({companyid: company_id["company_id"], timestamp: newDate});
            response["prevClose"]= currDateData["close"];

            var newDate =currDate.setDate(currDate.getDate()-52*7-1);
            let yearlyLowData = await stockData.find({ "timestamp" : { $gt: newDate} , companyid: company_id["company_id"]} ).sort({"low":1});
            yearlyLowData=yearlyLowData[0];
            let yearlyHighData = await stockData.find({ "timestamp" : { $gt: newDate} , companyid: company_id["company_id"]} ).sort({"high":1});
            yearlyHighData=yearlyHighData[yearlyHighData.length-1]
            console.log(yearlyHighData, yearlyLowData);
            response["52WeekHigh"]=yearlyHighData['high'] ;
            response["52WeekLow"]=yearlyLowData['low'] ;
            console.log(response);
            res.status(200).send({result:response});
        }
      };
      get_data();

    } );

module.exports = router;