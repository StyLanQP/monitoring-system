import Vue from "vue";
import App from "./App.vue";
import TraceKit from "tracekit";

Vue.config.productionTip = false;

TraceKit.report.subscribe((errorReport) => {
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
  console.log("2222", errorReport);
});

Vue.config.errorHandler = function(err) {
  // console.error("errorHandle:", err, vm, info);
  TraceKit.report(err);
};

window.addEventListener('error', args => {
  console.log(
    'error event:', args
  );
  return true;
}, 
true
);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
