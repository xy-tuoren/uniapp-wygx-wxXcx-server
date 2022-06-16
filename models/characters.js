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
    //文字文案
    characters: {
        type: String,
    },
    //是否有背景图片
    backgroundImage: {
        type:String
    },
    //文字类别
    category: {
        type:String,
    },
    //文字标签
    tags:[{
        type:String
    }],
    //喜欢数
    likeNum:{
        type:Number,
    },
    //文案属于哪个栏目
    column:{
        type:String
    }
})

const characters = mongoose.model('characters', imagesSchema);

module.exports = characters
