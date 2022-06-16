const characters = require('../models/characters');
const { verifyToken } = require('../utils/jsonWebToken');

module.exports = {
    async getCharactersDataByColumn(req,res,next){
        let { columnName,skipNum,needNum } = req.query
        columnName = decodeURIComponent(columnName);
        try {
            let categoryList = new Set();
            let columnData = await characters.find({column:columnName}).populate({
                path:'issueUser'
            }).sort('-issueTime').skip(skipNum).limit(needNum);
            columnData.forEach((item)=>{
                categoryList.add(item.category)
            })
            res.json({
                code:200,
                columnData,
                selectListData:[...categoryList]
            })
        }catch (e) {
            console.log(`获取${columnName}数据失败!`,e);
            res.json({
                code:-1,
                message:`获取${columnName}数据失败!`
            })
        }
    },
    async getCharactersByCategory(req,res,next){
        let { notId,columnName,skipNum,needNum } = req.query;
        columnName = decodeURIComponent(columnName);
        try {
            let imageData = await characters.find({category:columnName}).where('_id').nin(notId).populate({
                path:'issueUser'
            }).sort('-issueTime').skip(skipNum).limit(needNum);
            res.json({
                code:200,
                imageData
            })
        }catch (e) {
            console.log(`获取${columnName}数据失败!`,e);
            res.json({
                code:-1,
                message:`获取${columnName}数据失败!`
            })
        }
    },
    async getCharactersAllTagByCategory(req,res,next){
        let { CategoryName } = req.query
        CategoryName = decodeURIComponent(CategoryName);
        try {
            let imageData = await characters.find({category:CategoryName},{tags:1})
            let setList = new Set();
            let tagsList = []
            imageData.forEach((item)=>{
                item.tags.forEach((item2)=>{
                    setList.add(item2)
                })
            })
            setList.forEach((currValue)=>{
                tagsList.push({name:currValue})
            })
            res.json({
                code:200,
                tagsList
            })
        }catch (e) {
            console.log(`获取标签数据失败!`,e);
            res.json({
                code:-1,
                message:`获取标签数据失败!`
            })
        }
    },
    async getCharactersDataByTagAndCategory(req,res,next) {
        let {CategoryName,tagName,skipNum,needNum} = req.query
        tagName = decodeURIComponent(tagName);
        CategoryName = decodeURIComponent(CategoryName);
        try {
            let charactersData = await characters.find({category: CategoryName,tags:{$elemMatch:{$eq:tagName}}}).populate({
                path:'issueUser'
            }).sort('-issueTime').skip(skipNum).limit(needNum);
            console.log(charactersData);
            res.json({
                code: 200,
                charactersData
            })
        } catch (e) {
            console.log(`获取${CategoryName}分类${tagName}标签数据失败!`, e);
            res.json({
                code: -1,
                message: `获取${CategoryName}分类${tagName}标签数据失败!`
            })
        }
    }
}