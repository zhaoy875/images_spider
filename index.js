/**
 * [node_imgspider description]
 * @Author   zhaoy
 * @DateTime 2017-01-04T15:50:58+0800
 */
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const colors = require('colors');
const packagejson = require('./package.json');    
console.log("版本"+packagejson.version.cyan )
// 测试站点 jandan.net/ooxx
var urltxt    = 'http://jandan.net/ooxx/page-',
    startpage = 350,//起始页
    endpage   = 380,
    sourcedir = 'images'; //资源保存的根目录名
    
var picdir   = sourcedir + '/' +startpage + '_' + endpage + '/';
var creatdir = './' + picdir;
//创建 图片保存目录
fs.mkdir(creatdir, function(err) {
    if (err) {throw err};
    let newsourcesrc = '目录' + creatdir +'创建成功';
    console.log(newsourcesrc.rainbow);
});
for (var i = startpage; i < endpage; i++) {
    requrl = urltxt+i;

request(requrl,function (error,response,body){
	if (!error && response.statusCode == 200) {
		//console.log(body);
		analysisData(body); //采集
	};
})
// cheerio解析
function analysisData(ourdata) {
	var $ = cheerio.load(ourdata);
	var meizi = $('.text img').toArray();
	console.log( "第" + i + "页共" + meizi.length + "张");
	for (var i=0;i<meizi.length; i++){
        // indexOf获取的src是否带有前缀http:字符
        var meizis_src = meizi[i].attribs.src;
        if ( meizis_src.indexOf("http") > 0 ) {
            var imgsrc = meizis_src;
        } else{
            var imgsrc = 'http:' + meizis_src;
        };
		console.log(imgsrc.green);
		var filename = parseUrlForFileName(imgsrc);  //生成文件名
        downloadImg(imgsrc,filename,function() {
            console.log(filename + ' done');
        });
	}
}
//图片命名
function parseUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}
//NodeJs path API http://nodejs.org/api/path.html#path_path_basename_p_ext
// request.head请求,fs模块中的createWriteStream来下载到指定目录
var downloadImg = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
    //console.log('content-type:', res.headers['content-type']);  //返回图片的类型
    //console.log('content-length:', res.headers['content-length']);  //图片大小
    if (err) {
        console.log('err: '+ err);
        return false;
    }
    console.log('请求: '+ res);
    request(uri).pipe(fs.createWriteStream( picdir +filename)).on('close', callback);
    //request得到的流pipe到 picdir文件夹下
    });
};
};
