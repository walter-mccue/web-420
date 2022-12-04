/**
 * Title: mccue-customer.js
 * Author: Walter McCue
 * Date: 12/04/2022
 * Description: Customer Schema for MongoDB
 * Resources: WEB-420; WEB-420 GitHub
*/

// Require statement
const mongoose = require('mongoose');

// Creates Mongoose schema
const Schema = mongoose.Schema;

// Creates new Line Items under the schema
let lineItemSchema = new Schema({
    name: {type: String},
    price: {type: Number},
    quantity: {type: Number}
});

// Creates new Invoices under the schema
let invoiceSchema = new Schema({
    subtotal: {type: Number},
    tax: {type: Number},
    dateCreated: {type: String},
    dateShipped: {type: String},
    lineItem: [lineItemSchema]
});

// Creates new Customers under the schema
let customerSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    userName: {type: String},
    invoices: [invoiceSchema]
});

// Exports the schema
module.exports = mongoose.model('Customer', customerSchema);