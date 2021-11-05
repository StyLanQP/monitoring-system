import Vue from "vue";
import App from "./App.vue";
import TraceKit from "tracekit";
const http = require("http");
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

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

// // if (process.env.NODE_ENV === "production") {
//   Sentry.init({
//     release:'1.0.0',
//     dsn: "http://6246e2ccf71d497f96052f3fb05b27bc@localhost:9000/3",
//     integrations: [new Integrations.Vue({ Vue, attachProps: true })],
//   });
// // }

new Vue({
  render: (h) => h(App),
}).$mount("#app");
