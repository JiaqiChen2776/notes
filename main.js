const api = {
  request1: () => new Promise((resolve) => {
    setTimeout(() => {
      console.log('request1')
      resolve()
    }, 1000)
  }),
  request2: () => new Promise((resolve) => {
    setTimeout(() => {
      console.log('request2')
      resolve()
    }, 1000)
  }),
  request3: () => new Promise((resolve) => {
    setTimeout(() => {
      console.log('request3')
      resolve()
    }, 1000)
  }),
}

const requestAry = [() => api.request1(), () => api.request2(), () => api.request3()];
const finallyPromise = requestAry.reduce(
    (currentPromise, nextRequest) => {
      console.log('currentPromise', currentPromise, nextRequest.toString())
      return currentPromise.then(() => {
        return nextRequest()
      })
    },
    Promise.resolve('1') // 创建一个初始promise，用于链接数组内的promise
);

const test = async () => {
  Promise.resolve().then(() => {
    console.log(1);
  });
  await 2;
  console.log(2);
}
test()




const pendingPromises = {};
function request(type, url, data) {
  // 使用请求信息作为唯一的请求key，缓存正在请求的promise对象
  // 相同key的请求将复用promise
  const requestKey = JSON.stringify([type, url, data]);
  if (pendingPromises[requestKey]) {
    return pendingPromises[requestKey];
  }
  const fetchPromise = fetch(url, {
    method: type,
    data: JSON.stringify(data)
  })
  .then(response => response.json())
  .finally(() => {
    delete pendingPromises[requestKey];
  });
  return pendingPromises[requestKey] = fetchPromise;
}


Promise.resolve().then(
  () => {
    throw new Error('来自成功回调的错误');
  },
  () => {
    // 不会被执行
  }
).catch(reason => {
  console.log(reason.message); // 将打印出"来自成功回调的错误"
});
