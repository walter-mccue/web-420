/**
 * Title: mccue-session-routes.js
 * Author: Walter McCue
 * Date: 11/22/2022
 * Description: JavaScript for session routing/authentication
 * Resources: WEB-420; WEB-420 GitHub
*/

// Require statements
const express = require('express');
const router = express.Router();
const User = require('../models/mccue-users.js');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

/**
 * signup
 * @openapi
 * /api/users/signup:
 *   post:
 *     tags:
 *       - Users
 *     name: signup
 *     summary: Register a new user
 *     requestBody:
 *       description: Create a new User
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *               - emailAddress
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *               emailAddress:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Registered User
 *       '401':
 *         description: Username is already in use
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
 router.post('/users/:signup', async(req, res) => {
    try {
        User.findOne({ 'userName': req.body.userName }, function(err, user) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                console.log(user);
                if(!user) {
                    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds); // salt/hash the password
                    const newRegisteredUser = {
                        userName: req.body.userName,
                        password: hashedPassword,
                        emailAddress: req.body.emailAddress
                    }
                    User.create(newRegisteredUser, function(err, user) {
                        if(err) {
                            console.log(err);
                            res.status(500).send({
                                'message': `MongoDB Exception: ${err}`
                            })
                        } else {
                            res.json(user)
                        }
                    })
                } else {
                    res.status(401).send({
                        'message': `MongoDB Exception: ${err}`
                    })
                }
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
 * login
 * @openapi
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     name: Log In
 *     summary: Log in with userName and password
 *     requestBody:
 *       description: username/password
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in
 *       '401':
 *         description: Invalid userName and/or password
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/users/:login', async(req, res) => {
    try {
        User.findOne({'userName': req.body.userName}, function(err, user) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                if (passwordIsValid) {
                    console.log('User Logged In');
                    res.status(200).send({
                        'message': 'User Logged In'
                    })
                } else {
                    console.log('Password is incorrect');
                    res.status(401).send({
                        'message': `Invalid password`
                    })
                }
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e}`
        })
    }
});

module.exports = router;