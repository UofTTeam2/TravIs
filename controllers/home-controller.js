// Desc: This file will handle all of the home routes for the application
// =============================================================

// Dependencies, Models, and Middleware
// =============================================================
const router = require('express').Router();
const { Trip } = require('../models');
const loginAuth = require('../utils/auth');
const Amadeus = require('amadeus');
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    hostname: 'production' //use this to switch to production server, switch keys in .env file
});
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
        res.render('dashboard', {
            trips,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Start of Dashboard Demo
router.get('/dashboard', async (req, res) => {
    try {
      res.render('dashboard');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  // End of Dashboard Demo

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

router.get('/update', (req, res) => {
    res.render('update');
});

//==============================================================
router.get('/search', (req, res) => {
    res.render('search');
});

router.get('/poi/:lat/:lon', async (req, res) => {
    const lat = req.params.lat;
    const lon = req.params.lon;

    try {
        if (!lat || !lon) {
            return res
                .status(400)
                .json({ message: 'Latitude and Longitude are required' });
        }
        const poiResponse = await amadeus.referenceData.locations.pointsOfInterest.get({
            latitude: lat,
            longitude: lon,
        });
        const activityResponse = await amadeus.shopping.activities.get({
            latitude: lat,
            longitude: lon,
        });
        const safetyResponse = await amadeus.safety.safetyRatedLocations.get({
            latitude: lat,
            longitude: lon,
        });
        const locationResponse = await amadeus.location.analytics.categoryRatedAreas.get({
            latitude: lat,
            longitude: lon,
        });
        const poiData = await poiResponse.result.data;
        const activityData = await activityResponse.result.data;
        const safetyData = await safetyResponse.result.data;
        const locationData = await locationResponse.result.data;
        
        res.status(200).render('cityResults', {poiData, activityData, safetyData, locationData});

    } catch (error) {
        console.error('Error:', error.message);
        // res.status(500).redirect(`/poi/${lat}/${lon}`);
        res.status(500).json(error);
        console.error('Error: Our server is slow, please try again', error.message);
    }
});

module.exports = router;
