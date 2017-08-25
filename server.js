const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validator = require('validator');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));

const reservationsRoute = require('./server/routes/reservations.js');
app.use('/', reservationsRoute);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000 or http://127.0.0.1:3000');
});
