const express = require('express');
const router = express.Router();
const characters = require('../controller/characters.controller');

router.get('/getCharactersDataByColumn',characters.getCharactersDataByColumn);

router.get('/getCharactersByCategory',characters.getCharactersByCategory);

router.get('/getCharactersAllTagByCategory',characters.getCharactersAllTagByCategory);

router.get('/getCharactersDataByTagAndCategory',characters.getCharactersDataByTagAndCategory);

module.exports = router;
