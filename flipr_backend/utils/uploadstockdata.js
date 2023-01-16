const express = require("express");
const moment = require("moment");
const {stockData} = require("./../schemas/stockschema");
const mongoose = require("mongoose");
const fs = require("fs");
const { parse } = require("csv-parse");

var COMPANYLIST = [ "ASHOKLEY", "BSE" ,"CIPLA" ,  "EICHERMOT", "NSE","RELIANCE", "TATASTEEL"]

async function prepareData(CompanyName, id){
    var data =[];
    console.log(CompanyName);
    fs.createReadStream("./datasets/"+CompanyName+".csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        if( !isNaN(row[1])  && !isNaN(row[2])  && !isNaN(row[3])  && !isNaN(row[4])  && !isNaN(row[5])  && !isNaN(row[6])  ){
            data.push(
                {   
                    timestamp: new Date(row[0]).toISOString(),
                    open: parseFloat(row[1]),
                    high:  parseFloat(row[2]),
                    low:  parseFloat(row[3]),
                    close:  parseFloat(row[4]),
                    adjclose:  parseFloat(row[5]),
                    volume:  parseFloat(row[6]),
                    companyid : id
                }
            );
            // console.log( data.length, COMPANYLIST[i]);
        }
    })
    .on("end", async function () {
        console.log(data.length);
        await stockData.insertMany(data);
    });
}

async function uploadStockData() {
    var length_collection = await stockData.count();
    if (length_collection==0){
        console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", COMPANYLIST.length);
        for(let i=0;i<COMPANYLIST.length;i++){
            await prepareData(COMPANYLIST[i],i);
        }
    }
}

module.exports = {uploadStockData};