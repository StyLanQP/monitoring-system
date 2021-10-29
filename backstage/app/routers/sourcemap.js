var express = require("express");
const fs = require("fs");
const path = require("path");
const url = require("url");
const sourceMap = require("source-map");
let router = express.Router();

function delDir(url) {
  var files = [];
  /**
   * 判断给定的路径是否存在
   */
  if (fs.existsSync(url)) {
    /**
     * 返回文件和子目录的数组
     */
    files = fs.readdirSync(url);
    files.forEach(function (file, index) {
      var curPath = path.join(url, file);
      /**
       * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
       */
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    /**
     * 清除文件夹
     */
    fs.rmdirSync(url);
  } else {
    console.log("给定的路径不存在，请给出正确的路径");
  }
}

router.post("/upload", function (req, res) {
  // 获取map文件名
  const filename = req.query.filename;
  const url = path.join(__dirname, "../../", "sourcemap");
  // 清除文件夹
  //   delDir(url);
  if (!fs.existsSync(url)) {
    fs.mkdirSync(url);
  }
  const newFilename = path.join(url, filename);
  const writeStream = fs.createWriteStream(newFilename);
  req.pipe(writeStream);
  console.log("保存成功" + filename);
  res.send("上传成功");
});

router.get("/img", function (req, res) {
  const myUrl = url.parse(req.url, true);
  const { stack, message } = JSON.parse(myUrl.query.c);
  if (!stack) {
    console.log("sss", { message });
    return;
  }

  // 获取错误的文件名
  const fileName = path.basename(stack.url);
  // 找到对应的sourcemap文件
  const filePath = path.join(
    __dirname,
    "../../",
    "/sourcemap",
    "/" + fileName + ".map"
  );
  res.body = "";

  const readFile = function (filePath) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filePath, { encoding: "utf-8" }, function (error, data) {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(JSON.parse(data));
      });
    });
  };
  async function searchSource({ filePath, line, column, message }) {
    const rawSourceMap = await readFile(filePath);
    const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap);
    const res = consumer.originalPositionFor({
      line,
      column,
    });
    // 执行完销毁
    consumer.destroy();
    console.log("sss", { ...res, message });
    return res;
  }
  // 把握关键信息传进去， message是报错提示
  stack &&
    searchSource({ filePath, line: stack.line, column: stack.column, message });
});

module.exports = router;
