const request = require('request');
const cheerio = require('cheerio');
const images = require('../models/images');
const users = require('../models/users');
const characters = require('../models/characters');
const util = require('util');
const requestPro = util.promisify(request);

class RequestImageData {
    constructor() {

    }
    //抓取推荐的图片
    async getRecommendPathList(){
            let adminUser = await users.findOne({identity:2});
            let data = await requestPro('https://mip.woyaogexing.com//touxiang/')
            let $ = cheerio.load(data.body);
            $('.g-piclist-container .m-pic-list>.m-img-wrap').each((index,item)=>{
                requestPro(`https://mip.woyaogexing.com${$(item).children('a').attr('href')}`).then((res)=>{
                    let $$ = cheerio.load(res.body);
                    images.create({
                        column:'头像',
                        issueUser:adminUser._id,
                        userMessage:$(item).children('a').attr('title'),
                        category:$$('.g-page-content>.hot_link>.hot_link_t>a').text(),
                        likeNum:Math.ceil((Math.random()*99999)%1000),
                        issueTime:Date.now()
                    },function (err,data) {
                        $$('.g-page-content>.g-page-num>.m-page-tags>a').each((index2,item2)=>{
                            data.tags.push($$(item2).text());
                        })
                        $$('.g-page-content>.m-page-txlist .tx-box').each((index3,item3)=>{
                            data.imageList.push('https:'+$$(item3).find('.lazy').attr('data-src'));
                        })
                        data.save();
                    })
                })
            });
    }
    //抓取壁纸图片
    async getWallpaperPathList(){
        let adminUser = await users.findOne({identity:2});
        let data = await requestPro('https://mip.woyaogexing.com/shouji/')
        let $ = cheerio.load(data.body);
        $('.g-piclist-container .m-pic-list>.m-img-wrap').each((index,item)=>{
            requestPro(`https://mip.woyaogexing.com${$(item).children('a').attr('href')}`).then((res)=>{
                let $$ = cheerio.load(res.body);
                images.create({
                    column:'壁纸',
                    issueUser:adminUser._id,
                    userMessage:$(item).children('a').attr('title'),
                    category:$$('.g-page-content>.hot_link>.hot_link_t>a').text(),
                    likeNum:Math.ceil((Math.random()*99999)%1000),
                    issueTime:Date.now()
                },function (err,data) {
                    $$('.g-page-content>.g-page-num>.m-page-tags>a').each((index2,item2)=>{
                        data.tags.push($$(item2).text());
                    })
                    $$('.g-page-content>.m-page-imglist>.swipebox-img').each((index3,item3)=>{
                        data.imageList.push('https:'+$$(item3).find('.lazy').attr('data-src'));
                    })
                    data.save();
                })
            })
        });
    }
    //抓取美图数据
    async getPrettyPicturesPathList(){
        let adminUser = await users.findOne({identity:2});
        let data = await requestPro('https://mip.woyaogexing.com/tupian/')
        let $ = cheerio.load(data.body);
        $('.g-piclist-container .m-pic-list>.m-img-wrap').each((index,item)=>{
            requestPro(`https://mip.woyaogexing.com${$(item).children('a').attr('href')}`).then((res)=>{
                let $$ = cheerio.load(res.body);
                images.create({
                    column:'美图',
                    issueUser:adminUser._id,
                    userMessage:$(item).children('a').attr('title'),
                    category:$$('.g-page-content>.hot_link>.hot_link_t>a').text(),
                    likeNum:Math.ceil((Math.random()*99999)%1000),
                    issueTime:Date.now()
                },function (err,data) {
                    $$('.g-page-content>.g-page-num>.m-page-tags>a').each((index2,item2)=>{
                        data.tags.push($$(item2).text());
                    })
                    $$('.g-page-content>.m-page-txlist .tx-box').each((index3,item3)=>{
                        data.imageList.push('https:'+$$(item3).find('.lazy').attr('data-src'));
                    })
                    data.save();
                })
            })
        });
    }
    //抓取网名数据
    async getNetworkNameData(){
        let adminUser = await users.findOne({identity:2});
        let data = await requestPro('https://mip.woyaogexing.com/name/')
        let $ = cheerio.load(data.body);
        $('.m-class-list .m-txt>.u-t-content').each((index,item)=>{
            requestPro(`https://mip.woyaogexing.com${$(item).children('a').attr('href')}`).then((res)=>{
                let $$ = cheerio.load(res.body);
                characters.create({
                    column:'网名',
                    issueUser:adminUser._id,
                    category:$$('.g-page-txt>.hot_link>.hot_link_t>a').text().length > 0 ? $$('.g-page-txt>.hot_link>.hot_link_t>a').text() : '男生网名',
                    likeNum:Math.ceil((Math.random()*99999)%1000),
                    issueTime:Date.now(),
                    backgroundImage:'',
                    characters:$(item).children('a').attr('title')
                },function (err,data) {
                    $$('.g-page-txt>.g-page-num>.m-page-tags>a').each((index2,item2)=>{
                        data.tags.push($$(item2).text());
                    })
                    data.save();
                })
            })
        });
    }
    //抓取签名数据
    async getSignatureData(){
        let adminUser = await users.findOne({identity:2});
        let data = await requestPro('https://mip.woyaogexing.com/gexing/')
        let $ = cheerio.load(data.body);
        $('.m-class-list .m-txt>.u-t-content').each((index,item)=>{
            requestPro(`https://mip.woyaogexing.com${$(item).children('a').attr('href')}`).then((res)=>{
                let $$ = cheerio.load(res.body);
                characters.create({
                    column:'签名',
                    issueUser:adminUser._id,
                    category:$$('.g-page-txt>.hot_link>.hot_link_t>a').text().length > 0 ? $$('.g-page-txt>.hot_link>.hot_link_t>a').text() : '个性签名',
                    likeNum:Math.ceil((Math.random()*99999)%1000),
                    issueTime:Date.now(),
                    backgroundImage:'',
                    characters:$(item).children('a').attr('title')
                },function (err,data) {
                    $$('.g-page-txt>.g-page-num>.m-page-tags>a').each((index2,item2)=>{
                        data.tags.push($$(item2).text());
                    })
                    data.save();
                })
            })
        });
    }
}
module.exports = new RequestImageData();