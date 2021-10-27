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
      const filepath = path.join(
        stats.compilation.outputOptions.path,
        "**/*.js.map"
      );
      glob(
        filepath,
        stats.compilation.outputOptions.path,
        async (er, files) => {
          // console.log(files);
          // 开始上传
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await that.upload(file);
          }
        }
      );
    });
  }
  upload(file) {
    return new Promise((resolve) => {
      var options = {
        host: "localhost", //远端服务器域名
        port: 7001, //远端服务器端口号
        method: "POST",
        path: "/monitor/sourcemap?filename=" + path.basename(file), //上传服务路径
        headers: {
          "Content-Type": "application/octet-stream",
          Connection: "keep-alive",
        },
      };
      var req = http.request(options, function(res) {
        res.setEncoding("utf8");
        res.on('data', function (chunk) {
            // console.log('body: ' + chunk);
        });
        res.on('end',function(){
            // console.log('res end.');
        });
      });
      var fileStream = fs.createReadStream(file);
      fileStream.on("data", function(chunk) {
        //   console.log("data", chunk);
        req.write(chunk);
      });
      fileStream.on("end", function() {
        req.end();
        fs.unlinkSync(file);
        resolve();
      });
    });
  }
}

module.exports = SourcemapWebpackPlugin;
