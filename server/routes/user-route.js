const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const User = mongoose.model('User');
const sanitize = require('mongo-sanitize');

// TODO: Remove secret from code
const jwt = require('express-jwt');
const auth = jwt({
    secret: 'longer-secret-is-better',
    userProperty: 'payload'
});

// Register
router.post('/register', (req, res) => {
    let user = new User();
    user.firstName = sanitize(req.body.firstName);
    user.lastName = sanitize(req.body.lastName);
    user.email = sanitize(req.body.email);
    user.password = sanitize(req.body.password);

    user.setPassword(user.password);

    user.save(function () {
        let token = user.generateJwt();
        res.status(200).json({
            token: token
        });
    });
});

// Login
router.post('/login', (req, res) => {
    passport.authenticate('local', function (err, user) {

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }
        // If no user was found
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }

        // If a user is found
        let token = user.generateJwt();
        res.status(200).json({
            token: token
        });
    })(req, res);
});

// Get Single User
router.get('/profile', auth, (req, res) => {

    // If no user ID exists in the JWT return a 401
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        // Otherwise continue
        User.findById(req.payload._id)
            .exec(function (err, user) {
                res.status(200).json(user);
            });
    }
});

router.post('/checkEmailTaken', (req, res) => {
    User.findOne({ email: sanitize(req.body.email) }).then(user => {
        if (user) {
            return res.status(200).json({
                emailTaken: true
            });
        } else {
            return res.status(200).json({
                emailNotTaken: true
            });
        }
    });
});

router.patch('/updatePassword', (req, res) => {
    User.findOne({ email: sanitize(req.body.email) }).then(user => {
        if (user) {
            //check if old password is filled in correctly
            if (user.validatePassword(sanitize(req.body.oldPassword))) {
                //update password in database to new password
                user.setPassword(sanitize(req.body.newPassword));
                //save changes to database
                user.save();
                //return status ok
                return res.status(200).json({
                    message: "password changed"
                });
            } else {
                //handle error if old password doesn't match with the one in database
                return res.status(401).json({
                    message: "password doesn't match with old password"
                });
            }
        } else {
            console.log("user not found")
            //handle error if user is not found in database
            return res.status(401).json({
                message: "user not found"
            });
        }
    });
});

module.exports = router;