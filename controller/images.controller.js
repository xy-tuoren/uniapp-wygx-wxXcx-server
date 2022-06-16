const images = require('../models/images');
const users = require('../models/users');
const { verifyToken } = require('../utils/jsonWebToken');

module.exports = {
    async getRanColumnImage(req,res,next){
        try {
             const count = await images.count();
             const skipNum = Math.ceil(Math.random()*10000)%(count-5);
             const columnList = await images.find().select({
                 imageList:1
             }).skip(skipNum).limit(5)
            res.json({
                code:200,
                columnList
            })
        }catch (e) {
            console.log('获取失败!',e);
            res.json({
                code:-1,
                message:'获取失败!'
            })
        }
    },
    async getLikeImageIdList(req,res,next){
        try {
            const { token } = req.query;
            verifyToken(token)
                .then((data) => {
                    users.findOne({_id:data.user_id},{},function (err,userData) {
                        if (err) return err;
                        res.json({
                            code:200,
                            likeImageIdList:userData.imageCategory
                        })
                    });
                })
                .catch((err) => {
                    /* token 过期 */
                    if (err.name === "TokenExpiredError") {
                        return res.json({ code: -2, message: "登陆信息已过期请重新登陆!" });
                    } else {
                        return res.json({ code: -3, message: "非法的token!" });
                    }});
        }catch (e) {
            console.log('喜欢失败!',e);
            res.json({
                code:-1,
                message:'喜欢失败!'
            })
        }
    },
    async updateLikeNumById(req,res,next){
        try {
            const { _id,token } = req.query;
            verifyToken(token)
            .then((data) => {
                images.findOne({_id},{},(err,imageData)=>{
                    if (err) return err;
                    users.findOne({_id:data.user_id},{},function (err,userData) {
                        if (err) return err;
                        if(userData.imageCategory.includes(imageData._id)){
                            userData.imageCategory.splice(userData.imageCategory.indexOf(imageData._id),userData.imageCategory.indexOf(imageData._id)+1);
                            userData.save();
                            imageData.likeNum--;
                            imageData.save();
                            return res.json({
                                code:200
                            })
                        }
                        imageData.likeNum++;
                        imageData.save();
                        userData.imageCategory.push(imageData._id);
                        userData.save();
                        res.json({
                            code:200,
                            likeNum:imageData.likeNum
                        })
                    });
                })
            })
            .catch((err) => {
                /* token 过期 */
                if (err.name === "TokenExpiredError") {
                    return res.json({ code: -2, message: "登陆信息已过期请重新登陆!" });
                } else {
                    return res.json({ code: -3, message: "非法的token!" });
            }});
        }catch (e) {
            console.log('喜欢失败!',e);
            res.json({
                code:-1,
                message:'喜欢失败!'
            })
        }
    },
    async getCategoryDataCount(req,res,next){
        try {
            let { categoryName } = req.query
            let count = await images.count({category:categoryName});
            console.log(count);
            res.json({
                code:200,
                count
            })
        }catch (e) {
            console.log('获取数据失败!',e);
            res.json({
                code:-1,
                message:'获取数据失败!'
            })
        }
    },
    async getRecommend(req,res,next){
        try {
            const {needNum,skipNum} = req.query
            let recommend = await images.find().populate({
                path:'issueUser'
            }).sort('-issueTime').skip(skipNum).limit(needNum);
            res.json({
                code:200,
                recommend
            })
        }catch (e) {
            console.log('获取推荐数据失败!',e);
            res.json({
                code:-1,
                message:'获取推荐数据失败!'
            })
        }
    },
    async getColumnDataByName(req,res,next){
        let { columnName,skipNum,needNum } = req.query
        columnName = decodeURIComponent(columnName);
        try {
            let categoryList = new Set();
            let columnData = await images.find({column:columnName}).populate({
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
    async getAllTagListByCategory(req,res,next){
        let { CategoryName } = req.query
        CategoryName = decodeURIComponent(CategoryName);
        try {
            let imageData = await images.find({category:CategoryName},{tags:1})
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
    async getImageByCategory(req,res,next){
        let { notId,columnName,skipNum,needNum } = req.query;
        columnName = decodeURIComponent(columnName);
        try {
            let imageData = await images.find({category:columnName}).where('_id').nin(notId).populate({
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
    async getDataByTagAndCategory(req,res,next) {
        let {CategoryName,tagName,skipNum,needNum} = req.query
        tagName = decodeURIComponent(tagName);
        CategoryName = decodeURIComponent(CategoryName);
        try {
            let imageData = await images.find({category: CategoryName,tags:{$elemMatch:{$eq:tagName}}}).populate({
                path:'issueUser'
            }).sort('-issueTime').skip(skipNum).limit(needNum);
            res.json({
                code: 200,
                imageData
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