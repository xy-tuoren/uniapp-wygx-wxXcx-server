'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imagesSchema = new Schema({
    //发布用户
    issueUser:{
        type:Schema.Types.ObjectId,
        ref:'users',
        require: true
    },
    //发布时间
    issueTime: {
        type:Date,
        default:Date.now()
    },
    //用户想说的话
    userMessage: {
        type:String,
    },
    //图片列表(第一张为封面)
    imageList: [{
        type: String,
        default: ''
    }],
    //图片分类
    category: {
        type:String,
    },
    //图片标签
    tags:[{
        type:String
    }],
    //喜欢数
    likeNum:{
        type:Number,
    },
    //图片属于哪个栏目
    column:{
        type:String
    }
})

const Images = mongoose.model('images', imagesSchema);

module.exports = Images
