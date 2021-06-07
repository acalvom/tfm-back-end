require('dotenv').config();

const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./app/routes/authRoutes');
const usersRoutes = require('./app/routes/usersRoutes');
const workoutsRoutes = require('./app/routes/workoutsRoutes');
const classesRoutes = require('./app/routes/classesRoutes');
const reservesRoutes = require('./app/routes/reservesRoutes');
const newsRoutes = require('./app/routes/newsRoutes');

const port = process.env.PORT || 8000;

app.disable("x-powered-by");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.options('*', cors());
app.use(cors());

// Start the server
app.listen(port, function () {
    if (port === 8000)
        console.log("Node Server at http://localhost:" + port);
    else
        console.log("Node Server at: " + port);
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
app.use(reservesRoutes);
app.use(newsRoutes);

module.exports = app;
