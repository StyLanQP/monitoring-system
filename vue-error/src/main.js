import Vue from "vue";
import App from "./App.vue";
import TraceKit from "tracekit";
const http = require("http");

Vue.config.productionTip = false;

// 格式化错误对象
TraceKit.report.subscribe((errorReport) => {
  const { message, stack } = errorReport || {};
  var img = new Image();
  const stackItem = stack[0];
  let obj = {
    message,
    stack: {
      column: stackItem.column,
      line: stackItem.line,
      func: stackItem.func,
      url: stackItem.url,
    },
  };
  img.src = "http://localhost:4000/sourcemap/img?c=" + JSON.stringify(obj);
});

// vue 异常
Vue.config.errorHandler = function(err) {
  console.log("err", err);
  TraceKit.report(err);
};
// 监听异常
window.addEventListener(
  "error",
  (args) => {
    const err = args.target.src || args.target.href;
    if (err) {
      console.log("捕获到资源加载异常", err);
      var img = new Image();
      let obj = {
        message: "资源加载异常" + err,
      };
      img.src = "http://localhost:4000/sourcemap/img?c=" + JSON.stringify(obj);
    }
    return true;
  },
  true
);
new Vue({
  render: (h) => h(App),
}).$mount("#app");
