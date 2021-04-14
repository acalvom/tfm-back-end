const express = require('express')
const app = express();
const port = 8000;
cors = require('cors');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.options('*', cors());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World')
});

// Start the server
app.listen(port, function () {
    console.log("Node Server at http://localhost:" + port);
    console.log("Hour: " + Date());
});

module.exports = app;
