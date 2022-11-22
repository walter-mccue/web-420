/**
 * Title: mccue-users.js
 * Author: Walter McCue
 * Date: 11/22/2022
 * Description: User Schema for MongoDB
 * Resources: WEB-420; WEB-420 GitHub
*/

// Require statement
const mongoose = require('mongoose');

// Creates Mongoose schema
const schema = mongoose.schema;

// Creates new Users under the schema
let userSchema = new mongoose.Schema({
    userName: {type: String},
    password: {type: String},
    emailAddress: {type: Array},
});

// Exports the schema
module.exports = mongoose.model('User', userSchema);