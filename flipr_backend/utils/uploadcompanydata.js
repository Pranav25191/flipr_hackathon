const express = require("express");
const {stockSchema} = require("./../schemas/companyschema.js")
const {companyCollection} = require("./../schemas/companyschema")
const mongoose = require("mongoose");

var COMPANYLIST = [ "Ashok Leyland", "BSE" ,"Cipla" ,  "Eicher Motors", "NSE","Reliance", "Tata Steel"]


async function updateSchema() {
    var length_collection = await companyCollection.count();
    if (length_collection == 0){
        var data = []
        for (let i = 0; i < COMPANYLIST.length; i++) {
            data.push(
                {
                    company_id: i,
                    companyname: COMPANYLIST[i]
                }
            )
        }
        await companyCollection.insertMany(data);
    }
}

module.exports = {updateSchema};