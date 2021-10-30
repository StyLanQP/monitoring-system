// 自动上传Map
const SourcemapWebpackPlugin = require("./plugin/sourcemap-webpack-plugin");
const WebpackSentryPlugin = require("webpack-sentry-plugin");
const SentryCliPlugin = require('@sentry/webpack-plugin')
const path = require('path')
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  // 关闭eslint规则
  // webpack 配置里要加的很简单
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  //去除生产环境的productionSourceMap
  // productionSourceMap: false,
  lintOnSave: false,
  // configureWebpack: {
  //   plugins: [
  //     // 添加自动上传插件
  //     new SourcemapWebpackPlugin({
  //       uploadUrl: "http://localhost:7001/monitor/sourcemap",
  //       apiKey: "kaikeba",
  //     }),
  //   ],
  // },
  configureWebpack:(config)=> {
    if(isProduction) {
      config.plugins.push(
        new WebpackSentryPlugin({
          deleteAfterCompile: true, // 上传完 source-map 文件后要不要删除当前目录下的source-map 文件
          // Sentry options are required
          organization: "sentry", // 组名
          project: "vue1", // 当前项目名
          baseSentryURL: "http://localhost:9000/api/0", // 默认是 https://sentry.io/api/0，也即是上传到 sentry 官网上去，如果是自己搭建的 sentry 系统，那把sentry.io替换成你自己的sentry系统域名就行。
          apiKey:
            "67625e045cd2499295a57fedf21c10753431e26ff26f4c22b3161ac20df7a44c",
          // Release version name/hash is required
          // suppressErrors: true,
          release: '1.0.0',
        })
      )
    }
    // plugins: [
    //   // new SentryCliPlugin({
    //   //   release: "production@1.1.0",//版本号
    //   //   include: path.join(__dirname,'../dist/js/'), //需要上传到sentry服务器的资源目录,会自动匹配js 以及map文件
    //   //   ignore: ['node_modules', 'webpack.config.js'], //忽略文件目录,当然我们在inlcude中制定了文件路径,这个忽略目录可以不加
    //   //   configFile :'.sentryclirc',  
    //   //   urlPrefix : "~/static/js"    //  线上对应的url资源的相对路径 比如我的域名是 http://XXX  .com/,静态资源都在 static文件夹里面,
    //   // })
    // ]
  },
  chainWebpack: (config) => {
    config.mode = "production";
  },
};
