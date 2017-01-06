/**
 * [node_imgspider description]
 * @Author   zhaoy
 * @DateTime 2017-01-04T15:50:58+0800
 */
// const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const colors = require('colors');
const packagejson = require('./package.json');    
console.log("版本"+packagejson.version.cyan )

// 测试站点例如 jandan.net/ooxx/page-1000
var urltxt    = 'http://jandan.net/ooxx/page-',
    startpage = 1000,//起始页
    endpage   = 1011,
    sourcedir = 'images', //资源保存的根目录名
    picdir   = sourcedir + '/' +startpage + '_' + endpage + '/',
    creatdir = './' + picdir;

// --------------------------------------
// 创建 图片保存目录
// fs.mkdir 这里有个隐患，直接使用 对已存在的文件夹创建时会报错，在不存在的一级目录下创建二级目录也会报错，待封装fs.mkdir后再修改
// --------------------------------------
fs.mkdir(creatdir, function(err) {
    if (err) {throw err};
    //let newsourcesrc = '目录' + creatdir +'创建成功';console.log(newsourcesrc.cyan);
});

// --------------------------------------
// 爬取指定范围页
// --------------------------------------
console.log('---------------开始抓取页面内容---------------'.cyan);
for (var i = startpage; i < endpage; i++) {
    var requrl = urltxt+i;

    request(requrl,function (error,response,body){
        if (!error && response.statusCode == 200) {
            //console.log(body);
            analysisData(body); //采集主函数
        };
    })
    // 数据解析抓取主函数
    function analysisData(ourdata) {
        var $ = cheerio.load(ourdata);
        var pic = $('.text .view_img_link').toArray();
        var thispage = "当前页" + pic.length + "张";console.log( thispage.rainbow);
        console.time("创建当前页下载任务计时");
        for (var i=0;i<pic.length; i++){
            // indexOf筛选src是否带有前缀http,此处取的是查看原图<a>的href,若$('.text img')则将herf改为src,其他站点类推
            var pics_src = pic[i].attribs.href;
            if ( pics_src.indexOf("http") > 0 ) {
                var imgsrc = pics_src;
            } else{
                var imgsrc = 'http:' + pics_src;
            };
            console.log(imgsrc.green);
            var filename = parseUrlForFileName(imgsrc);  //生成文件名

            downloadImg(imgsrc,filename,function() {
                console.log(filename.cyan + ' done');
            });
        }
        console.timeEnd("创建当前页下载任务计时");
    }
    //图片命名
    function parseUrlForFileName(address) {
        var filename = path.basename(address);
        return filename;
    }
    // --------------------------------------
    // 下载保存
    // NodeJs path API http://nodejs.org/api/path.html#path_path_basename_p_ext
    // request.head==》》fs模块createWriteStream写入到指定目录
    // 爬取资源较大时有待 用async来限制一下异步的并发，由于node并发连接数太多可能会被和谐
    // --------------------------------------
    var downloadImg = function(uri, filename, callback){
        request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);  //返回图片的类型
        console.log('content-length:', res.headers['content-length']);  //图片大小
            if (err) {
                console.log('err: '+ err);
                return false;
            }
            console.log('请求: '+ res);
            request(uri).pipe(fs.createWriteStream( picdir +filename)).on('close', function(){
                console.log(filename.cyan +"保存成功");//request的流数据pipe保存到 picdir文件夹下
            });
        });
    };
};
