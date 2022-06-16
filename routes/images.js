const express = require('express');
const router = express.Router();
const images = require('../controller/images.controller');

router.get('/getRecommend',images.getRecommend);

router.get('/getColumnDataByName',images.getColumnDataByName);

router.get('/getImageByCategory',images.getImageByCategory);

router.get('/getAllTagListByCategory',images.getAllTagListByCategory);

router.get('/getDataByTagAndCategory',images.getDataByTagAndCategory);

router.get('/getCategoryDataCount',images.getCategoryDataCount);

router.get('/updateLikeNumById',images.updateLikeNumById);

router.get('/getLikeImageIdList',images.getLikeImageIdList);

router.get('/getRanColumnImage',images.getRanColumnImage);

module.exports = router;
