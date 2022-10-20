/**
 * Title: app.js
 * Author: Walter McCue
 * Date: 10/20/2022
 * Description: WEB 420 RESTful APIs
 * Resources: WEB-340; WEB-340 GitHub; W3Schools.com; geeksforgeeks.com
 */

// Require statements
const express = require('express');
const http = require('http');
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const mongoose = require('mongoose');
const app = express();

// Uses port 3000
const PORT = process.env.PORT || 3000;

// Express statements
app.use(express.json());
app.use(express.urlencoded({ extend: true }));

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

// Sets any files that use spi-docs,
// to use swagger-jsdoc and swagger-ui-express with the options object definition
const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));

// Starts the server and logs the port to launch in browser
http.createServer(app).listen(PORT, () => {
    console.log('Application started and listening on port ' + PORT)
});