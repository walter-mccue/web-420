/**
 * Title: app.js
 * Author: Walter McCue
 * Date: 10/20/2022
 * Description: WEB 420 RESTful APIs
 * Resources: WEB-420; WEB-420 GitHub; W3Schools.com; geeksforgeeks.com
 */

// Require statements
const express = require('express');
const http = require('http');
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const mongoose = require('mongoose');
const composerAPI = require('./routes/mccue-composer-routes');

// app variable
const app = express();

// Uses port 3000
const PORT = process.env.PORT || 3000;

// Express statements
app.use(express.json());
app.use(express.urlencoded({ extend: true }));

// MongoDB Connection
const conn = 'mongodb+srv://web420_user:s3cret@web420db.7by1lvq.mongodb.net/web420DB';
mongoose.connect(conn, {
    promiseLibrary: require('bluebird'),
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log(`Connection to web420DB on MongoDB Atlas successful`);
}).catch(err => {
    console.log(`MongoDB Error: ${err.message}`);
});

// options Object
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WEB 420 RESTful APIs',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js']
};

// Sets OAS
const openapiSpecification = swaggerJsdoc(options);

// Sets APIs to use OAS
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));
app.use('/api', composerAPI);

// Starts the server and logs the port to launch in browser
http.createServer(app).listen(PORT, () => {
    console.log('Application started and listening on port ' + PORT)
});