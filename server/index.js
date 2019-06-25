require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const auth = require('./controllers/authcontroller')
const treasureCtrl = require('./controllers/treasureController')
const authMid = require('./middleware/authMiddleware');


const { SESSION_SECRET, CONNECTION_STRING, SERVER_PORT } = process.env;

const app = express();

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
  console.log('db connected');
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);

app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`));

app.post('/auth/register', auth.register)
app.post('/auth/login', auth.login);
app.get('/auth/logout', auth.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user',authMid.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, treasureCtrl.getAllTreasure);