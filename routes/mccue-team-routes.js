/**
 * Title: mccue-team-routes.js
 * Author: Walter McCue
 * Date: 12/18/2022
 * Description: JavaScript for team routing
 * Resources: WEB-420; WEB-420 GitHub
*/

// Require statements
const express = require('express');
const router = express.Router();
const Team = require('../models/mccue-teams.js');

/**
 * createTeam
 * @openapi
 * /api/teams:
 *   post:
 *     tags:
 *       - Teams
 *     name: createTeam
 *     description: API for adding a new team document to MongoDB Atlas
 *     summary: Creates a new team document
 *     requestBody:
 *       description: Team information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *               - mascot
 *               - players
 *             properties:
 *               name:
 *                 description: Name of the team
 *                 type: string
 *               mascot:
 *                 description: Mascot for the team
 *                 type: string
 *               players:
 *                 description: Players in the team
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     salary:
 *                       type: number
 *     responses:
 *       '200':
 *         description: Team Added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/teams', async(req, res) => {
    try {
        const newTeam = {
            name: req.body.name,
            mascot: req.body.mascot,
            players: req.body.players
        };

        Team.create(newTeam, function(err, team) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                });
            } else {
                console.log(team);
                res.json(team);
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
 * findAllTeams
 * @openapi
 * /api/teams:
 *   get:
 *     tags:
 *       - Teams
 *     description: API for returning an array of team objects.
 *     summary: returns an array of teams in JSON format.
 *     responses:
 *       '200':
 *         description: Array of team documents.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */

 router.get('/teams', async(req, res) => {
    try {
    Team.find({}, function(err, teams) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                console.log(teams);
                res.json(teams);
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
 * assignPlayerToTeam
 * @openapi
 * /api/teams/{id}/players:
 *   post:
 *     tags:
 *       - Teams
 *     name: assignPlayerToTeam
 *     description: API for assigning a new player to a team.
 *     summary: Creates a player and assigns it to a team document in MongoDB. 
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Team Id to filter the collection by.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Player information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - salary
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Player document
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/teams/:id/players', async (req, res) => {
    try {
        const teamId = req.params.id;
        Team.findOne({_id: teamId}, function(err, team) {
            if (err) {
                console.log(err);
                res.status(401).send({
                    'message': `Invalid teamId: ${err}`
                });
            } else {
                team.players.push({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    salary: req.body.salary
                });
                team.save(function(err, savedTeam) {
                    if (err) {
                        console.log(err);
                        res.status(501).send({
                            'message': `MongoDB Exception: ${err}`
                        });
                    } else {
                        console.log(savedTeam);
                        res.json(savedTeam);
                        res.status(200).send({
                            'message': 'Player document'
                        });
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
 * findAllPlayerByTeamId
 * @openapi
 * /api/teams/{id}/players:
 *   get:
 *     tags:
 *       - Teams
 *     description:  API for returning a team document showing all players
 *     summary: Shows all players in a team
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Team document id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Team document
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get('/teams/:id/players', async(req, res) => {
    try {
        const teamId = req.params.id;
        Team.findOne({'_id': teamId}, function(err, team) {
            if (err) {
                console.log(err);
                res.status(401).send({
                    'message': `Invalid teamId: ${err}`
                })
            } else {
                console.log(team.players);
                res.json(team.players);
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
 * deleteTeamById
 * @openapi
 * /api/teams/{id}:
 *   delete:
 *     tags:
 *       - Teams
 *     name: deleteTeam
 *     description: API for deleting a team document from MongoDB.
 *     summary: Removes a team document from MongoDB.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the team document to remove. 
 *         schema: 
 *           type: string
 *     responses:
 *       '200':
 *         description: Team document
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete('/teams/:id', async (req, res) => {
    try {
        const teamId = req.params.id;
        Team.findByIdAndDelete({_id: teamId}, function(err, team) {
            if (err) {
                console.log(err);
                res.status(401).send({
                    'message': `Invalid teamId: ${err}`
                });
            } else {
                console.log(team);
                res.json(team);
                res.status(200).send({
                    'message': `Team document: ${err}`
                });
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        });
    }
});

module.exports = router;