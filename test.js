window.onerror = (...args) => {
  console.log("onerror:", args);
  return true
};

// window.addEventListener('error', args => {
//     console.log(
//       'error event:', args
//     );
//     return true;
//   }, 
//   true // 利用捕获方式
// );

// getNum(num)
// new Promise((resolve, reject) => {
//   abc();
//   resolve();
// });

// a()
// window.addEventListener("unhandledrejection", e => {
//     console.log('unhandledrejection',e)
//     throw e
//   });
