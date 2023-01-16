const mongoose = require('mongoose');

const companyschema = new mongoose.Schema({
    company_id: { type: Number, index: true },
    companyname: { type: String, required: true }
}
);

const companyCollection = mongoose.model('CompanyData', companyschema);

module.exports = {companyschema,companyCollection};