const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 8000;
const authRoutes = require('./app/routes/authRoutes');
const usersRoutes = require('./app/routes/usersRoutes');
const workoutsRoutes = require('./app/routes/workoutsRoutes');
const classesRoutes = require('./app/routes/classesRoutes');

app.disable("x-powered-by");
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
    res.send('Welcome to our gym!')
});

app.use(authRoutes);
app.use(usersRoutes);
app.use(workoutsRoutes);
app.use(classesRoutes);

module.exports = app;
