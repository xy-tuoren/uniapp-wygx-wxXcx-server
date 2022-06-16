const config = require('../config.js')
const nodemailer = require('nodemailer');//导入模块

function send(mail,code) 
{             // 发送目标 发送的看具体内容
    let transporter = nodemailer.createTransport({
        host: config.email.server,//邮件主机类型可以在lib库中选择
        port: config.email.port,//端口（不同的端口发送不同的邮箱，这里为QQ邮箱）
        secure: true,
        service: 'qq',
        auth: {//作者
            user: config.email.sender, // 发送者
            pass: config.email.secret // 发送者的邮箱smtp， 这个可以自行百度就是QQ邮箱的一个密钥
        }
    });
    // 这里写邮件的详情信息
   let obj= {
        from: `"历神👻" <${config.email.sender}>`, // 发送者
        to: mail, // 接收者
        subject: '注册验证码',
        text: `您正在注册我的我要个性网青春版,验证码:${code}验证码保持五分钟。`, //信息描述
    }
    // 开始发送
    return transporter.sendMail(obj)
}
module.exports= send;