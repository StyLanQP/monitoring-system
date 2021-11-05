// 自动上传Map
const SourcemapWebpackPlugin = require("./plugin/sourcemap-webpack-plugin");
const WebpackSentryPlugin = require("webpack-sentry-plugin");
const SentryCliPlugin = require("@sentry/webpack-plugin");
const path = require("path");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  // 关闭eslint规则
  // webpack 配置里要加的很简单
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy: {
      "/api": {
        target: "http://localhost:9000/",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
  //去除生产环境的productionSourceMap
  // productionSourceMap: false,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      // 添加自动上传插件
      new SourcemapWebpackPlugin(),
    ],
  },
  // configureWebpack: (config) => {
  //   if (isProduction) {
  //     config.plugins.push(
  //       new WebpackSentryPlugin({
  //         deleteAfterCompile: true, // 上传完 source-map 文件后要不要删除当前目录下的source-map 文件
  //         // Sentry options are required
  //         organization: "sentry", // 组名
  //         project: "vue", // 当前项目名
  //         baseSentryURL: "http://localhost:9000/api/0", // 默认是 https://sentry.io/api/0，也即是上传到 sentry 官网上去，如果是自己搭建的 sentry 系统，那把sentry.io替换成你自己的sentry系统域名就行。
  //         apiKey:
  //           "a33817b6cbfd435ebbdf5e7ed00da0720f8b317c8a964e1d8068960552d97b5b",
  //         // Release version name/hash is required
  //         // suppressErrors: true,
  //         release: "1.1.0",
  //       })
  //     );
  //   }
  // },
  chainWebpack: (config) => {
    config.mode = "production";
  },
};
