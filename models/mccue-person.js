/**
 * Title: mccue-person.js
 * Author: Walter McCue
 * Date: 11/17/2022
 * Description: Person Schema for MongoDB
 * Resources: WEB-420; WEB-420 GitHub
*/

// Require statement
const mongoose = require('mongoose');

// Creates Mongoose schema
const schema = mongoose.schema;

// Creates new Roles under the schema
let roleSchema = new mongoose.Schema({
    text: {type: String}
});

// Creates new Dependents under the schema
let dependentSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String}
});

// Creates new Person under the schema
let personSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    roles: [roleSchema],
    dependents: [dependentSchema],
    birthDate: {type: String}
});

// Exports the schemas
module.exports = mongoose.model('Person', personSchema);