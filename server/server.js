const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const userRoutes = require('./routes/users');
const scoreRoutes = require('./routes/scores');
const questionRoutes = require('./routes/questions');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Express session
app.use(
    session({
        secret: process.env.JWT_SECRET, // Use the same secret here
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/questions', questionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
