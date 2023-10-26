// Project: TravIs
// File Created: 2023-10-17
// Desc: Main server file for the application.
// This file will be used to start the server and connect to the database.
// The server will be listening on port 3001.
//==============================================================

// Dependencies
// =============================================================
const express = require('express');
const sequelize = require('./config/connection');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
const exphbs = require('express-handlebars');
// load env variables
require('dotenv').config();
//==============================================================

//importing routes, Session model and custom middlewares
// =============================================================
const routes = require('./controllers');
const Session = require('./models/Session');
const helpers = require('./utils/helpers');
//initializes handlebars template engine
const hbs = exphbs.create({
    helpers,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});
// import dataParser middleware
const dataParser = require('./utils/dataParser');
//==============================================================

//defines express application and PORT
// =============================================================
const app = express();
const PORT = process.env.PORT || 3001;
//==============================================================

// Access the session secret from the environment variables
// =============================================================
const sessionSecret = process.env.SESSION_SECRET;

//defining express session
const sess = {
    secret: sessionSecret,
    cookie: {
        // Session will automatically expire after one hour
        expires: 60 * 60 * 1000,
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
        table: 'sessions', // Name of the database table to store sessions
    }),
};

app.use(session(sess));
//==============================================================

// Registering handlebars as the template engine of choice
// =============================================================
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//==============================================================

// Sets up the custom middleware & Express app to handle data parsing
// =============================================================
app.use(dataParser);
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);
//==============================================================

// sync sequelize models to the database, then start running the server
// =============================================================
sequelize.sync({force: false}).then(() => {
    app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});

/* ETHAN'S TEMPORARY CODE FOR TESTING HANDLEBARS BELOW, COMMENT IT OUT IF IT'S CAUSING PROBLEMS */

const {id, title, start_date, end_date, image, public, sections} = require('./seeds/sampleItineraryDataGET.js');

const expenses = [1200, 500, 200, 1000, 200];

app.get('/test', async (req, res) => {
    try {
        res.render('bad-request', {id, title, start_date, end_date, image, public, expenses, sections});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

/* ETHAN'S TEMPORARY CODE FOR TESTING HANDLEBARS ABOVE, COMMENT IT OUT IF IT'S CAUSING PROBLEMS */
