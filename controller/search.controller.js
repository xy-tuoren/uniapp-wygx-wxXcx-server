const images = require('../models/images');
const characters = require('../models/characters');
const users = require('../models/users');
const { verifyToken } = require('../utils/jsonWebToken');

function getDatabase(columnName){
    switch (columnName) {
        case '用户': return users;
        case '签名': return characters;
        case '网名': return characters;
        default: return images
    }
}

module.exports = {
    async searchDateByColumnAndKeyword(req,res,next){
        let {columnName,keyword} = req.query;
        try {
            keyword = decodeURIComponent(keyword);
            columnName = decodeURIComponent(columnName);
            let resultList;
            switch (columnName) {
                case '用户': resultList = await users.find().or([{name:{$regex:`${keyword}`,$options:"$i"}},{signature:{$regex:`${keyword}`,$options:"$i"}}]).sort('-issueTime');
                    break;
                case '签名':
                case '网名': resultList = await characters.find({column: columnName}).or([{characters:{$regex:`${keyword}`,$options:"$i"}},{category:{$regex:`${keyword}`,$options:"$i"}},{tags:{$elemMatch: {$eq:keyword}}}]).sort('-issueTime');
                    break;
                default: resultList = await images.find({column: columnName}).or([{userMessage:{$regex:`${keyword}`,$options:"$i"}},{category:{$regex:`${keyword}`,$options:"$i"}},{tags:{$elemMatch: {$eq:keyword}}}]).sort('-issueTime');
            }
            res.json({
                code:200,
                resultList
            })
        }catch (e) {
            console.log(`搜索${columnName},${keyword}失败!`, e);
            res.json({
                code: -1,
                message: `搜索${columnName},${keyword}失败!`
            })
        }
    },
    async getCategoryByColumn(req,res,next) {
        let {columnName} = req.query
        columnName = decodeURIComponent(columnName);
        try {
            let categoryList = new Set();
            let columnData = await getDatabase(columnName).find({column: columnName}, {category: 1}).sort('-issueTime').limit(9);
            columnData.forEach((item) => {
                categoryList.add(item.category)
            })
            res.json({
                code: 200,
                categoryData: [...categoryList]
            })
        } catch (e) {
            console.log(`获取${columnName}数据失败!`, e);
            res.json({
                code: -1,
                message: `获取${columnName}数据失败!`
            })
        }
    }
}