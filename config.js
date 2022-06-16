module.exports = {
        mongodbUrl: "mongodb://localhost:27017/UniappWx",
        post: 3000,
        serverAddress: process.env.NODE_ENV==='development' ? `http://localhost:3000` : '',
        email: {
                "sender": "2895845213@qq.com",
                "secret": "mzmpyuooldapdcih",
                "server": "smtp.qq.email",
                "port": 465
        },
}