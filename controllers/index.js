// Dec: The centeral hub for all routing files
// Notes: This file is used to collect the packaged group of
// API endpoints and prefix them with the path / api.
// =============================================================

// Dependencies
// =============================================================
const router = require('express').Router();
const apiController = require('./api');
//const homeController = require('./home-controller');
const homeRoutes = require('./homeRoutes');
const loginRoutes = require('./loginRoutes');
const dashboardRoutes = require('./dashboardRoutes');

//==============================================================

// Routes
// =============================================================
//router.use('/', homeController);
router.use('/', dashboardRoutes);
router.use('/', homeRoutes);
router.use('/', loginRoutes);
router.use('/api', apiController);
//==============================================================

module.exports = router;
