import Vue from "vue";
import App from "./App.vue";
import TraceKit from "tracekit";

Vue.config.productionTip = false;

TraceKit.report.subscribe((errorReport) => {
  // 在这里可以通过ajax进行数据上报
  const {message, stack} = errorReport || {};
  var img = new Image();
  let obj  ={
    message,
    stack: {
      column: stack[0].column,
      line: stack[0].line,
      func: stack[0].func,
      url: stack[0].url
    }
  }
  img.src = "http://localhost:7001/monitor/img?c="+JSON.stringify(obj);
  // img.src = "http://localhost:7001/monitor/img?c="+'JSON.stringify(obj)';
  console.log("2222", JSON.stringify(obj));
});

Vue.config.errorHandler = function(err, vm, info) {
  console.error("errorHandle:", err, vm, info);
  TraceKit.report(err);
};

new Vue({
  render: (h) => h(App),
}).$mount("#app");
