const express = require('express');
const helmet = require("helmet");
const path = require('path');
const mongoose = require('mongoose');
const sauceSchema = require('./models/sauceSchema');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const dotenv = require("dotenv");

dotenv.config();

mongoose.set('strictQuery', false);
mongoose.connect( process.env.SECRET_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  
app.use(helmet());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;