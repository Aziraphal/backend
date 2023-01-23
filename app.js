const express = require('express');

const mongoose = require('mongoose');
const sauceSchema = require('./models/sauceSchema');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');
const app = express();
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://kaogan:HzfkQmYGQ4rcfYl1@cluster0.mbv90uy.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app;