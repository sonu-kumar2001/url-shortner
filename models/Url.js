const mongoose = require("mongoose");
let urlSchema = new mongoose.Schema({
  urlLong: {
    type: String,
    required: true,
  },
  urlShort: {
    type: String,
    required: true,
  },
  urlCode: {
    type: String,
  },
  numberOfClick: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Url", urlSchema);
