const users = require('../routes/users');
const images = require('../routes/images');
const characters = require('../routes/characters');
const search = require('../routes/search');

module.exports = app => {
  app.use('/users',users);
  app.use('/images',images);
  app.use('/characters',characters);
  app.use('/search',search);
};
