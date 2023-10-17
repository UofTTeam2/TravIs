// Project: TravIs
// File Created: 2023-10-17
// Desc: Main server file for the application.
// This file will be used to start the server and connect to the database.
// The server will be listening on port 3001.
//-------------------------------------------------------------------

const express = require('express');
const sequelize = require('./config/connection');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
const exphbs = require('express-handlebars');
// load env variables
require('dotenv').config();

//importing routes and custom helpers
const routes = require('./controllers');
const helpers = require('./utils/helpers');
//initializes handlebars template engine
const hbs = exphbs.create({ helpers });

//defines express application and PORT
const app = express();
const PORT = process.env.PORT || 3001;

// Access the session secret from the environment variables
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
    }),
};

app.use(session(sess));

//sets express application to use handlebars engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

// sync sequelize models to the database, then start running the server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
