// File: ./models/products.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  code: String,
  name: String,
  price: Number,
  qty: Number
});

var QuotationSchema = new Schema({
  table: [ProductSchema],
  date: Date
});

//Export function to create "QuotationSchema" model class
module.exports = mongoose.model('Quotation', QuotationSchema);