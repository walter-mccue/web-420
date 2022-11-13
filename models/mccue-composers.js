/**
 * Title: mccue-composer.js
 * Author: Walter McCue
 * Date: 11/12/2022
 * Description: Composer Schema for MongoDB
 * Resources: WEB-420; WEB-420 GitHub
*/

// Require statement
const mongoose = require('mongoose');

// Creates Mongoose schema
const schema = mongoose.schema;

// Creates new Composers under the schema
let composerSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
});

// Exports the schema
module.exports = mongoose.model('Composer', composerSchema);