const fs = require("fs");
const glob = require("glob");
const path = require("path");
const http = require("http");
const pluginName = "SourcemapWebpackPlugin";

class SourcemapWebpackPlugin {
  apply(compiler) {
    const that = this;
    compiler.hooks.done.tap(pluginName, (stats) => {
      // for(var hook of Object.keys(stats.compilation)){
      //     console.log(hook);
      // }
      // 查找打包后的sourcema文件
      const filepath = path.join(
        stats.compilation.outputOptions.path,
        "**/*.js.map"
      );
      glob(
        filepath,
        stats.compilation.outputOptions.path,
        async (er, files) => {
          for (let i = 0; i < files.length; i++) {
            // 遍历上传
            that.upload(files[i]);
          }
        }
      );
    });
  }
  upload(file) {
    var options = {
      host: "localhost", //远端服务器域名
      port: 4000, //远端服务器端口号
      method: "POST",
      path: "/sourcemap/upload?filename=" + path.basename(file), //上传服务路径
      headers: {
        "Content-Type": "application/octet-stream",
        Connection: "keep-alive",
      },
    };
    var req = http.request(options, function(res) {
      res.setEncoding("utf8");
      res.on("data", function(chunk) {
        // console.log('body: ' + chunk);
      });
      res.on("end", function() {
        // console.log('res end.');
      });
    });
    var fileStream = fs.createReadStream(file);
    fileStream.on("data", function(chunk) {
      req.write(chunk);
    });
    fileStream.on("end", function() {
      req.end();
      // 上传后就删除sourcemap文件，因为生产环境不需要
      fs.unlinkSync(file);
    });
  }
}

module.exports = SourcemapWebpackPlugin;
