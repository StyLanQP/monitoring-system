const express = require('express');
// body-parser是一个HTTP请求体解析的中间件，使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体
const bodyParser = require("body-parser");
const path = require("path");

var app = express();

app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json({
    limit: '1mb'
}));
app.use(bodyParser.urlencoded({
    extended: true
})); //解析post参数


//添加路由到应用上
app.use('/', require('./routers/index'));
app.use('/sourcemap', require('./routers/sourcemap'));


module.exports = app;