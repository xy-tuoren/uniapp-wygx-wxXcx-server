const users = require('../models/users');
const { createToken,verifyToken } = require('../utils/jsonWebToken');
const send = require("../utils/mailsend");
const randomStr = require('randomstring')

module.exports = {
    async login(req,res,next){
        try {
            const { email,password } = req.body;
            const userData = await users.findOne({email,password});
            if (userData) {
                const token = createToken({ user_id:userData._id,login: true });
                res.json({
                    code:200,
                    token,
                    userData,
                    message:'欢迎回来,欧尼酱!'
                })
            }else {
                res.json({
                    code:-1,
                    message:'账号或者密码错误!'
                })
            }
        }catch (e) {
            res.json({
                code:-1,
                message:'账号或者密码错误!'
            })
        }
    },
    async register(req,res,next){
        const {password,verify,email} = req.body;
        //没有密码和验证码为验证邮箱下一步
        if (!password && !verify && email){
            if (await users.findOne({email})){
                res.json({
                    code:200,
                    isRegister:true,
                    message:'当前账号已被注册!'
                })
            }else {
                let code = parseInt(Math.random()*999999);
                send(email, code)
                .then((v) => {
                    if (req.app.locals[email]) {
                        req.app.locals[email].verifyCode = code;
                        clearTimeout(req.app.locals[email].timer);
                        req.app.locals[email].timer = setTimeout(()=>{
                            delete req.app.locals[email]
                        },5*60*1000)
                    }else{
                        req.app.locals[email] = {};
                        req.app.locals[email].verifyCode = code;
                        req.app.locals[email].timer = setTimeout(()=>{
                            delete req.app.locals[email]
                        },5*60*1000)
                    }
                    return res.json({ code: 200,message:'已发送验证码到邮箱'});
                })
                .catch((reason) => {
                    console.log(reason);
                    return res.json({ code: -1, message: '发送失败,请检查邮箱' });
                });
            }
            return
        }
        if (email && password && verify){
            if (!req.app.locals[email]){
                return res.json({ code: 200, message: '验证码已失效!' });
            }
            if (req.app.locals[email].verifyCode.toString() !== verify){
                return res.json({ code: 200, message: '验证码错误!' });
            }
            let userInfo = await users.create({
                email,
                password,
                name:'历神'+randomStr.generate(5),
                create_time:Date.now()
            })
            const token = createToken({ user_id:userInfo._id, login: true });
            clearTimeout(req.app.locals[email].timer);
            delete req.app.locals[email];
            res.json({ code: 200,token,message: '注册成功' });
            return
        }
        res.json({ code: -1, message: '参数错误!' })
    },
    getUserInfo(req,res,next){
        const { token } = req.query;
        verifyToken(token)
            .then((data) => {
                users.findOne({_id:data.user_id},{},function (err,data) {
                    res.json({
                        code:200,
                        data
                    });
                });
            })
            .catch((err) => {
                /* token 过期 */
                if (err.name === "TokenExpiredError") {
                    return res.json({ code: -2, message: "登陆信息已过期请重新登陆!" });
                } else {
                    return res.json({ code: -3, message: "非法的token!" });
                }});
    },
    logout(req,res,next){
        res.json({
            code:200,
            message:'ok'
        });
    }
}