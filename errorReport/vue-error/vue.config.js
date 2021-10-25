// 自动上传Map
const SourceMapPlugin = require("./plugin/source-map-plugin");
module.exports = {
  // 关闭eslint规则
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  //去除生产环境的productionSourceMap
  // productionSourceMap: false,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      // 添加自动上传插件
      new SourceMapPlugin({
        uploadUrl: "http://localhost:7001/monitor/sourcemap",
        apiKey: "kaikeba",
      }),
    ],
  },
  chainWebpack: (config)=>{
    config.mode = "production";
  }
};
