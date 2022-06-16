const express = require('express');
const router = express.Router();
const search = require('../controller/search.controller');

router.get('/getCategoryByColumn',search.getCategoryByColumn);

router.get('/searchDateByColumnAndKeyword',search.searchDateByColumnAndKeyword);

module.exports = router;
