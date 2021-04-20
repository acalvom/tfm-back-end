const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 8000;
const connectDB = require('./app/routes/getDBVerification');
const user = require('./app/routes/users/userRest');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.options('*', cors());
app.use(cors());

// Start the server
app.listen(port, function () {
    console.log("Node Server at http://localhost:" + port);
    console.log("Hour: " + Date());
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello World')
});

app.get('/connectdb', connectDB.showDB);
app.post('/users/login', user.userLogin);

// This is only to validate token verification
app.get('/records/:email', user.validToken);

module.exports = app;
