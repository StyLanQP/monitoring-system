/* eslint-disable no-unused-vars */
'use strict';

const Controller = require('egg').Controller;
// const { getOriginSource } = require('../utils/sourcemap');
const fs = require('fs');
const path = require('path');
const url = require('url');
const sourceMap = require('source-map');

class MonitorController extends Controller {
  async index() {
    const { ctx } = this;
    const { info } = ctx.query;
    const json = JSON.parse(Buffer.from(info, 'base64').toString('utf-8'));
    console.log('fronterror:', json);
    // ctx.body = '';
    // 记入错误日志
    this.ctx.getLogger('frontendLogger').error(json);
    ctx.body = '';
  }
  async upload() {
    const { ctx } = this;
    console.log("hhhh", ctx.query)
    const stream = ctx.req;
    const filename = ctx.query.filename;
    const dir = path.join(this.config.baseDir, 'uploads');
    // 替换文件
    if (!fs.existsSync(dir)) {
      // fs.unlinkSync(dir);
      fs.mkdirSync(dir);
    }

    const target = path.join(dir, filename);
    const writeStream = fs.createWriteStream(target);
    stream.pipe(writeStream);
  }
  async img() {
    const { ctx } = this;
    const myUrl = url.parse(ctx.url, true);
    const { stack } = JSON.parse(myUrl.query.c);
    const fileName = path.basename(stack.url);
    const filePath = path.join(__dirname, '../../', '/uploads', '/' + fileName + '.map');
    ctx.body = '';

    const readFile = function(filePath) {
      return new Promise(function(resolve, reject) {
        fs.readFile(filePath, { encoding: 'utf-8' }, function(error, data) {
          if (error) {
            console.log(error);
            return reject(error);
          }
          resolve(JSON.parse(data));
        });
      });
    };
    // Find the source location
    async function searchSource(filePath, line, column) {
      const rawSourceMap = await readFile(filePath);
      const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap);
      const res = consumer.originalPositionFor({
        line,
        column,
      });
      console.log('999', consumer.destroy);
      consumer.destroy();
      // return res;
    }

    searchSource(filePath, stack.line, stack.column);
    console.log('aaa', filePath);
  }

}


module.exports = MonitorController;
