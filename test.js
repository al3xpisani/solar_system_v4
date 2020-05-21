var delay = function(s) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, s);
  });
};

delay()
  .then(function() {
    console.log(1); // 顯示 1
    return delay(1000); // 延遲ㄧ秒
  })
  .then(function() {
    console.log(2); // 顯示 2
    return delay(1000); // 延遲一秒
  })
  .then(function() {
    console.log(3); // 顯示 3
  });
