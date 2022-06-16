const mongoose = require('mongoose')
const { mongodbUrl } = require('../config')

mongoose.connect(mongodbUrl);

const db = mongoose.connection;

db.once('open' ,() => {
    console.log('连接数据库成功地址为:',mongodbUrl);
})

db.on('error', function(error) {
    console.error('数据库连接异常' + error);
    mongoose.disconnect();
});

db.on('close', function() {
    console.log('数据库断开，重新连接数据库');
    mongoose.connect(mongodbUrl);
});

module.exports = db;