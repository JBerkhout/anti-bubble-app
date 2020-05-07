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
    // var query = { category : req.headers.id };
    console.log(req.headers.id);
    Shop.find(query)
        .exec(function (err, shop) {
            res.status(200).json(shop);
        });
});

//router to register an item in the database
router.post('/create', (req, res) => {
    //make a new shop item
    let shop = new Shop();
    //fill in data to shop attributes
    shop.title = "Hoedje";
    shop.category = "hoed";
    shop.image = "/assets/images/Test_hoedje_1.png";
    shop.price = "5";
    //save the changes to the database
    shop.save((error) => { 
        if (error){
            console.log(error.message);
        } 
    });
});

router.post('/buy', auth, (req, res) => {
    User.findById(req.payload._id)
            .exec(function (err, user) {
                user.inventory.push(req.body.item);
                user.save();
                res.status(200);
            });
});

module.exports = router;