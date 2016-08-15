var config = require('config.json');
var express = require('express');
var router = express.Router();
var dbService = require('routes/services/db.service');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.post('/forgotpassword', forgotPassword);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);

module.exports = router;

function authenticateUser(req, res) {
    dbService.authenticate(req.body.username, req.body.password, req.body.inlineRadioOptions)
        .then(function (token) {
            if (token) {
                console.log('authentication successful');
                res.send({ token: token });
            } else {
                console.log('authentication failed');
                res.sendStatus(401);
            }
        })
        .catch(function (err) {
            console.log('catch in authenticateUser : user.controller.js', err);
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    dbService.create(req.body)
        .then(function () {
            console.log('then');
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);
            res.status(400).send(err);
        });
}

function forgotPassword(req, res) {
console.log('in api users.js forgotpassword function');

    dbService.usercheck(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    dbService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    dbService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    dbService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
} 