'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    //用户账号
    email:{
        type:String,
        require: true
    },
    //用户性别
    sex:Number, //1男 2女 0男
    //用户姓名
    name: String,
    //用户密码
    password: {
        type:String,
        require: true
    },
    //用户创建时间
    create_time: {
        type:Date,
        default:new Date()
    },
    //用户身份
    identity: {
       type:Number,
       default:0
    },  //0:普通用户 1:普通管理、 2:超级管理员
    //用户头像
    avatar: {type: String, default: 'default.jpg'},
    //用户签名
    signature: {
        type: String,
        default: '这个用户还没有签名呢'
    },
    //用户的关注
    attention:[{
        type:Schema.Types.ObjectId,
        ref:'users'
    }],
    //用户的粉丝
    fans:[{
        type:Schema.Types.ObjectId,
        ref:'users'
    }],
    //用户喜欢的分类图片类作品
    imageCategory:[{
        type:Schema.Types.ObjectId,
        ref:'images'
    }],
    //用户喜欢的分类文字类作品
    textCategory:[{
        type:Schema.Types.ObjectId,
        ref:'textCategory'
    }]
})

const Users = mongoose.model('users', usersSchema);

// Users.create({
//     email:'admin',
//     sex:'1',
//     name:'历神'
//     password:'admin',
//     identity:2,
//     signature:'我是超管',
// })

module.exports = Users
