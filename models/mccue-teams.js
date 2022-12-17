/**
 * Title: mccue-teams.js
 * Author: Walter McCue
 * Date: 12/18/2022
 * Description: Team Schema for MongoDB
 * Resources: WEB-420; WEB-420 GitHub
*/

// Require statement
const mongoose = require('mongoose');

// Creates Mongoose schema
const Schema = mongoose.Schema;

// Creates new Players under the schema
let playerSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    salary: {type: Number}
});

// Creates new Teams under the schema
let teamSchema = new Schema({
    name: {type: String},
    mascot: {type: String},
    players: [playerSchema]
});

// Exports the schema
module.exports = mongoose.model('Team', teamSchema);