/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Items = mongoose.model('items');
const Users = mongoose.model('users');
const jwt = require('express-jwt');

// Small constant for authentication.
const auth = jwt({
	secret: process.env.MY_SECRET,
	userProperty: 'payload'
});

/**
 * GET method to get shop items from the database belonging to a certain category.
 */
router.get('/', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		Items.find({ category: req.headers.type.toLowerCase() }, (err, items) => {
			return res.status(200).json(items);
		});
	}
});

/**
 * GET method to get all the items from the database that the user get when they first create
 * their account.
 */
router.get('/getBaseInventory', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {
		Items.find({ initial: true }, (err, items) => {
			return res.status(200).json(items);
		});
	}
});

/**
 * POST method for a user to but a given item from the shop.
 */
router.post('/buy', auth, (req, res) => {

	// Check if user is authorized to perform the action.
	if (!req.payload._id) {
		return res.status(401).json({ message: 'UnauthorizedError: unauthorized action' });
	} else {

		// Get the logged in user.
		Users.findById(req.payload._id, (err, user) => {

			// Check if the user has enough money and hasnt bought the item yet.
			if (user.currency >= req.body.item.price && user.inventory.find(x => x._id === req.body.item._id) == null) {

				// Add item to inventory.
				user.inventory.push(req.body.item);

				// Pay the money.
				user.currency -= req.body.item.price;
				user.markModified('inventory');
				user.save().then(() => {
					return res.status(200).json({ succes: true, message: `Je hebt ${req.body.item.title} succesvol gekocht!` });
				}).catch((err) => {
					return res.status(500).json({ message: err });
				});
			} else {
				if (user.currency < req.body.item.price) {

					// If not enough money, show appropriate message.
					return res.status(200).json({
						succes: false,
						message: `Je hebt niet genoeg geld om ${req.body.item.title} te kopen`
					});
				} else {

					// Else show message that item has already been bought.
					return res.status(200).json({ succes: false, message: `Je hebt ${req.body.item.title} al gekocht` });
				}
			}
		});
	}
});

module.exports = router;