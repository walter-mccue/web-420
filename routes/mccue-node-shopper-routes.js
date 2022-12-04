/**
 * Title: mccue-composer-routes.js
 * Author: Walter McCue
 * Date: 11/12/2022
 * Description: JavaScript for composer routing
 * Resources: WEB-420; WEB-420 GitHub
*/

// Require statements
const express = require('express');
const router = express.Router();
const Customer = require('../models/mccue-customer.js');

/**
 * createCustomer
 * @openapi
 * /api/customers:
 *   post:
 *     tags:
 *       - Customers
 *     name: createCustomer
 *     summary: Creates a new customer document
 *     requestBody:
 *       description: Customer information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - userName
 *             properties:
 *                firstName:
 *                   description: First name of customer
 *                   type: string
 *                lastName:
 *                   description: Last name of customer
 *                   type: string
 *                userName:
 *                   description: userName of customer
 *                   type: string
 *     responses:
 *       '200':
 *         description: Customer added to MongoDB
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
 router.post('/customers', async(req, res) => {
    try {
        const newCustomer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName
        }
        Customer.create(newCustomer, function(err, customer) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                console.log(customer);
                res.json(customer);
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
});

/**
 * createInvoice ByUserName
 * @openapi
 * /api/customers/{username}/invoices:
 *   post:
 *     tags:
 *       - Customers
 *     name: createInvoiceByUserName
 *     summary: Creates a new invoice by userName document
 *     parameters:
 *       - name: userName
 *         in: path
 *         required: true
 *         description: Find userName by updated with new Invoice
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Creates a new Invoice
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - subtotal
 *               - tax
 *               - dateCreated
 *               - dateShipped
 *               - lineItems
 *             properties:
 *                subtotal:
 *                   description: Subtotal of each line item added together after multiplying price and quantity
 *                   type: number
 *                tax:
 *                   description: Tax to be applied to the invoice
 *                   type: number
 *                dateCreated:
 *                   description: Date the invoice was created
 *                   type: string
 *                dateShipped:
 *                   description: Date the order shipped
 *                   type: string
 *                lineItems:
 *                   description: Items in the Invoice
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         description: Name of the item
 *                         type: string
 *                       price:
 *                         description: Price of the item
 *                         type: number
 *                       quantity:
 *                         description: Quantity being ordered
 *                         type: number
 *     responses:
 *       '200':
 *         description: Invoice added to MongoDB
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
 router.post('/customers/:userName/invoices', async(req, res) => {
    try {
        Customer.findOne({ userName: req.params.userName }, function (err, customer) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                res.status(200).send({
                    'message': 'Invoice added to MongoDB',
                })
                const newInvoice = {
                    userName: req.params.userName,
                    subtotal: req.body.subtotal,
                    tax: req.body.tax,
                    dateCreated: req.body.dateCreated,
                    dateShipped: req.body.dateShipped,
                    lineItems: req.body.lineItems
                }
                customer.invoices.push(newInvoice);
                customer.save();
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
});

/**
 * findAllInvoicesByUserName
 * @openapi
 * /api/customers/{username}/invoices:
 *   get:
 *     tags:
 *       - Customers
 *     name: findAllInvoicesByUserName
 *     summary: Returns an array of invoices in JSON format by userName
 *     responses:
 *       '200':
 *         description: Array of Invoices.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
 router.get('/customers/:userName/invoices', async(req, res) => {
    try {
        Customer.findOne({ userName: req.params.userName }, function(err, customer) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                console.log(customer.invoices);
                res.json(customer.invoices);
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
});

module.exports = router;