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
const Composer = require('../models/mccue-composers.js');

/**
 * findAllComposers
 * @openapi
 * /api/composers:
 *   get:
 *     tags:
 *       - Composers
 *     description: API for returning an array of fruit objects.
 *     summary: returns an array of composers in JSON format.
 *     responses:
 *       '200':
 *         description: array of composer documents.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
 router.get('/composers', async(req, res) => {
    try {
    Composer.find({}, function(err, composers) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                console.log(composers);
                res.json(composers);
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
 * findComposerById
 * @openapi
 * /api/composers/{id}:
 *   get:
 *     tags:
 *       - Composers
 *     description:  API for returning a composer document
 *     summary: returns a composer document
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Composer document id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Composer document
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get('/composers/:id', async(req, res) => {
    try {
        Composer.findOne({'_id': req.params.id}, function(err, composer) {
            if (err) {
                console.log(err);
                res.status(500).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                console.log(composer);
                res.json(composer);
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
 * createComposer
 * @openapi
 * /api/composers:
 *   post:
 *     tags:
 *       - Composers
 *     name: createComposer
 *     description: API for adding a new composer document to MongoDB Atlas
 *     summary: Creates a new composer document
 *     requestBody:
 *       description: Composer information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *                firstName:
 *                   description: First name of composer
 *                   type: string
 *                lastName:
 *                   description: Last name of composer
 *                   type: string
 *     responses:
 *       '200':
 *         description: Composer added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/composers', async(req, res) => {
    try {
        const newComposer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        }

        await Composer.create(newComposer, function(err, composer) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                console.log(composer);
                res.json(composer);
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
 * updateComposerById
 * @openapi
 * /api/composers/{id}:
 *   put:
 *     tags:
 *       - Composers
 *     name: updateComposer
 *     description: API for updating an existing document in MongoDB.
 *     summary: Updates a document in MongoDB. 
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id to filter the collection by.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Composer information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Array of composer documents
 *       '401':
 *         description: Invalid composerId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
 router.put('/composers/:id', async (req, res) => {
    try {
        const composerId = req.params.id;

        Composer.findOne({_id: composerId}, function(err, composer) {
            if (err) {
                console.log(err);
                res.status(401).send({
                    'message': `Invalid composerId: ${err}`
                });
            } else {
                console.log(composer);

                composer.set({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                });

                composer.save(function(err, savedComposer) {
                    if (err) {
                        console.log(err);
                        res.status(501).send({
                            'message': `MongoDB Exception: ${err}`
                        });
                    } else {
                        console.log(savedComposer);
                        res.json(savedComposer);
                    }
                });
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        });
    }
});

/**
 * deleteComposerById
 * @openapi
 * /api/composer/{id}:
 *   delete:
 *     tags:
 *       - Composers
 *     name: deleteComposer
 *     description: API for deleting a document from MongoDB.
 *     summary: Removes a document from MongoDB.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the document to remove. 
 *         schema: 
 *           type: string
 *     responses:
 *       '200':
 *         description: Composer document
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete('/composer/:id', async (req, res) => {
    try {
        const composerId = req.params.id;

        Composer.findByIdAndDelete({_id: composerId}, function(err, composer) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                console.log(composer);
                res.json(composer);
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
})

module.exports = router;