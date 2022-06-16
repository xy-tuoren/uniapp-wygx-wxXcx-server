const express = require('express');
const router = express.Router();
const users = require('../controller/users.controller');

router.get('/getUserInfo',users.getUserInfo);

router.post('/register',users.register);

router.post('/login',users.login);

router.get('/logout',users.logout);


module.exports = router;
