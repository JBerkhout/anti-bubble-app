const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");
const Shop = mongoose.model('Shop');
const sanitize = require('mongo-sanitize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = mongoose.model('User');
const Item = mongoose.model('Item');

const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.MY_SECRET,
    userProperty: 'payload'
});

//router to gets shop items from the database based on a query
router.get('/', (req, res) => {
    
    var query;
    switch(req.headers.id) { 
        case "Hoofddeksels": { 
            query = { category : "hoofddeksel" };
            break; 
        } 
        case "Kleding": { 
            query = { category : "kleding" };
            break; 
        } 
        default: { 
            query = { };
            break;  
        } 
     } 

    console.log(req.headers.id);
    Shop.find(query)
        .exec(function (err, shop) {
            res.status(200).json(shop);
        });
});

router.post('/buy', auth, (req, res) => {
    User.findById(req.payload._id)
            .exec(function (err, user) {
                if (user.currency >= req.body.item.price && user.inventory.find(x => x._id == req.body.item._id) == null) {
                    user.inventory.push(req.body.item);
                    user.currency -= req.body.item.price;
                    user.save();
                    res.status(200).json( { succes: true, message: `Je hebt ${req.body.item.title} succesvol gekocht!` } );
                } else {
                    if (user.currency < req.body.item.price) {
                        res.status(200).json( { succes: false, message: `Je hebt niet genoeg geld om ${req.body.item.title} te kopen` } );
                    } else {
                        res.status(200).json( { succes: false, message: `Je hebt ${req.body.item.title} al gekocht` } );
                    }
                }
            });
});

module.exports = router;