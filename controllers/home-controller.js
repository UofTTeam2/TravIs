// Desc: This file will handle all of the home routes for the application
// =============================================================

// Dependencies, Models, and Middleware
// =============================================================
const router = require('express').Router();
const { Trip } = require('../models');
const loginAuth = require('../utils/auth');
//==============================================================

// Get route for the home page
// =============================================================
router.get('/', async (req, res) => {
    try {
        res.render('homepage', {
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
//==============================================================

// Get route for the dashboard page
// =============================================================
router.get('/trips', loginAuth, async (req, res) => {
    try {
        const tripData = await Trip.findAll({
            where: {
                user_id: req.session.user_id,
            },
            order: [['end_date', 'DESC']],
        });
        const trips = tripData.map((trip) => trip.get({ plain: true }));
        res.render('trip', {
            trips,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get route for the signup page
// =============================================================
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});
//==============================================================

//Get route for the login page
// =============================================================
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});
//==============================================================

module.exports = router;