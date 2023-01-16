const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    timestamp: { type: Date, index: true },
    open: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    close: { type: Number, required: true },
    adjclose: { type: Number, required: true },
    volume: { type: Number, required: true },
    companyid : {type: Number, required: true},
    metadata: {
        companyid: Number,
    },
    nse: {type: Boolean},
    bse: {type: Boolean}
},
{
    timeseries: {
      timeField: 'timestamp',
      metaField: 'metadata',
      granularity: 'hours',
    },
  }
);


const stockData = mongoose.model('stockData', stockSchema);


module.exports = {stockSchema, stockData};
