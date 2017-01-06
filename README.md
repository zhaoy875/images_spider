# Images_spider
简易 nodejs图片爬虫
这是第一版比较简单粗糙，后面再逐步完善和扩充应用的范围，如发现错请还请指正，谢谢

## 概述
首先爬虫能做的我们手动都能做，但它帮我们能更快的做一些机械重复性劳动，当然程序干的就是提高效率这回事。废话不多说，说正事。
### 基本思路
在我们想要批量爬取资源的站点，通过审查代码和观察url请求来找出一些规律，不同网站复杂程度各不相同，通常爬图片这种算比较简单的，

- 分析规律，构造请求的页面地址，nodejs模块request模拟请求页面数据（简单静态页复杂些的可能还需要模拟ajax请求截取数据），

- 利用cheerio模块从请求的页面数据中解析出我们需要的资源地址(类jquery 操作dom的库)，

- 最后就是简单的批量下载了（瞬间发送大量的请求可能会被站点和谐掉，所以一次性爬取的量很大的时候注意async限制异步并发的请求量，并发控制要视不同站点区别对待，这里暂时没做）

## 用法
本爬虫在windows,linux,安卓（安装模拟器Termux搭建node环境，操作流程同pc）平台都通用。
安装nodejs、git等环境步骤这里就不重复了。

拷贝本目录
```
git clone git@github.com:zhaoy875/images_spider.git
```

安装相关依赖，切到clone的目录下安装依赖在运行(推荐用cnpm install)，具体爬虫参数修改看注释，如有错请指正
```
cd images_spider
cnpm install 
```
## 爬虫跑起来 index.js
```
node index
```
