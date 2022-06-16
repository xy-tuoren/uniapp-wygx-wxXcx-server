var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const router = require('./routes/index.js');
const { verifyToken } = require('./utils/jsonWebToken');
require('./mongodb/db');

var app = express();
// require('./utils/requestImageData').getRecommendPathList()
// require('./utils/requestImageData').getWallpaperPathList()
// require('./utils/requestImageData').getPrettyPicturesPathList()
// require('./utils/requestImageData').getNetworkNameData()
// require('./utils/requestImageData').getSignatureData()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//token验证 get请求+post(login/register/upload)请求不需要token,其余都需要检查token
app.use('*',function (req,res,next) {
  let method = req.method.toLocaleLowerCase();
  let path = req.baseUrl.toString().toLocaleLowerCase();
  if (method === 'get' || path.includes('register') || path.includes('login') || path.includes('upload')) {
    return next();
  } else {
    let token = req.get("token");
    if (!!token) {
      verifyToken(token).then(()=>{
        console.log("*********token check success!**********")
        return next();
      }, (err) => {
        /* token 过期 */
        if (err.name === "TokenExpiredError") {
          return res.json({ code: -1, message: "登陆信息已过期请重新登陆!" });
        } else {
          return res.json({ code: -1, message: "非法的token!" });
        }});
    } else {
      res.status(200);
      res.json({
        code: -1,
        message: "need token!"
      });
    }
}})


router(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
