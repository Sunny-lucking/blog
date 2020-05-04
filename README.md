



![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS84NThlYTAzYi01MTlhLTQ0NGYtYThlMC00NTM4NDU4YjhiMjYucG5n?x-oss-process=image/format,png)


## 0.1. 第一问：了解 Promise 吗？
1) 了解Promise，Promise是一种异步编程的解决方案，有三种状态，pending（进行中）、resolved（已完成）、rejected（已失败）。当Promise的状态由pending转变为resolved或reject时，会执行相应的方法

2) Promised的特点是只有异步操作的结果，可以决定当前是哪一种状态，任务其他操作都无法改变这个状态，也是“Promise”的名称的由来，同时，状态一旦改变，就无法再次改变状态



## 0.2. 第二问：Promise 解决的痛点是什么？
Promise解决的痛点：

1）回调地狱，代码难以维护， 常常第一个的函数的输出是第二个函数的输入这种现象，是为解决异步操作函数里的嵌套回调（callback hell）问题，代码臃肿，可读性差，只能在回调里处理异常

2）promise可以支持多个并发的请求，获取并发请求中的数据

3）promise可以解决可读性的问题，异步的嵌套带来的可读性的问题，它是由异步的运行机制引起的，这样的代码读起来会非常吃力

4）promise可以解决信任问题，对于回调过早、回调过晚或没有调用和回调次数太少或太多，由于promise只能决议一次，决议值只能有一个，决议之后无法改变，任何then中的回调也只会被调用一次，所以这就保证了Promise可以解决信任问题
5)Promise最大的好处是在异步执行的流程中，把执行代码和处理结果的代码清晰地分离了
## 0.3. 第三问：Promise 解决的痛点还有其他方法可以解决吗？如果有，请列举。

1）Promise 解决的痛点还有其他方法可以解决，比如setTimeout、事件监听、回调函数、Generator函数，async/await

2）setTimeout：缺点不精确，只是确保在一定时间后加入到任务队列，并不保证立马执行。只有执行引擎栈中的代码执行完毕，主线程才会去读取任务队列

3）事件监听：任务的执行不取决于代码的顺序，而取决于某个事件是否发生

4）Generator函数虽然将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。即如何实现自动化的流程管理

5）async/await

## 0.4. 第四问：Promise 如何使用？
1）创造一个Promise实例

2）Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数

3）可用Promise的try和catch方法预防异常

## 0.5. 第五问：Promise 的业界实现都有哪些？
1） promise可以支持多个并发的请求，获取并发请求中的数据

2）promise可以解决可读性的问题，异步的嵌套带来的可读性的问题，它是由异步的运行机制引起的，这样的代码读起来会非常吃力

## 0.6. 第六问： Promise的问题？解决办法？
promise的问题为：

promise一旦执行，无法中途取消

promise的错误无法在外部被捕捉到，只能在内部进行预判处理

promise的内如何执行，监测起来很难

解决办法

正是因为这些原因，ES7引入了更加灵活多变的async，await来处理异步

## 0.7. 第七问：老旧浏览器没有Promise全局对象增么办?

果辛辛苦苦写完代码，测试后发现不兼容IE6、7增么办？难道要推翻用回调函数重写？当然不是这样，轮子早就造好了。

我们可以使用es6-promise-polyfill。es6-promise-polyfill可以使用页面标签直接引入，可以通过es6的import方法引入（如果你是用webpack），在node中可以使用require引入，也可以在Seajs中作为依赖引入。

引入这个polyfill之后，它会在window对象中加入Promise对象。这样我们就可以全局使用Promise了。


## 0.8. 第八问：怎么让一个函数无论promise对象成功和失败都能被调用？

**笨方法：**

在两个回调中分别执行一次函数。

**推荐方式：**

扩展一个 Promise.finally()，finally方法用于指定不管Promise对象最后状态如何，都会执行的操作，它与done方法的最大区别在于，它接受一个普通的回调函数作为参数，该函数不管怎样都必须执行。

```js
//添加finally方法
Promise.prototype.finally=function (callback) {
   var p=this.constructor;
   return this.then(//只要是promise对象就可以调用then方法
     value => p.resolve(callback()).then(() => value),
     reason => p.resolve(callback()).then(() => {throw reason})
   );
}
```
对finally方法的理解：
(1)p.resolve(callback())这句函数callback已经执行
(2)finally方法return的是一个promise对象，所以还可以继续链式调用其他方法
(3)对于Promise.resolve方法

```
Promise.resolve('foo');
等价于
new Promise(resolve => resolve('foo'));
```
所以可以通过then方法的回调函数 接受 实例对象返回的参数
比如：

```
Promise.resolve(function(){console.log(2);}).then(function(cb){cb()}) 
```


## 0.9. 第九问：红灯3秒亮一次，绿灯1秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？（用Promise实现）三个亮灯函数已经存在：

```js
function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}
```
`解析`
红灯3秒亮一次，绿灯1秒亮一次 ，黄灯2秒亮一次，意思就是3秒执行一次red函数，2秒执行一次green函数，1秒执行一次yellow函数，不断交替重复亮灯，意思就是按照这个顺序一直执行这3个函数，这步可以利用递归来实现。
答案:

```js
function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}

var light = function (timmer, cb) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            cb();
            resolve();
        }, timmer);
    });
};

var step = function () {
    Promise.resolve().then(function () {
        return light(3000, red);
    }).then(function () {
        return light(2000, green);
    }).then(function () {
        return light(1000, yellow);
    }).then(function () {
        step();
    });
}

step();
```

## 0.10. 第十问:实现 mergePromise 函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组 data 中。


```
const timeout = ms => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, ms);
});

const ajax1 = () => timeout(2000).then(() => {
    console.log('1');
    return 1;
});

const ajax2 = () => timeout(1000).then(() => {
    console.log('2');
    return 2;
});

const ajax3 = () => timeout(2000).then(() => {
    console.log('3');
    return 3;
});

const mergePromise = ajaxArray => {
    // 在这里实现你的代码

};

mergePromise([ajax1, ajax2, ajax3]).then(data => {
    console.log('done');
    console.log(data); // data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]
```
**解析**
首先 ajax1 、ajax2、ajax3 都是函数，只是这些函数执行后会返回一个 Promise，按题目的要求我们只要顺序执行这三个函数就好了，然后把结果放到 data 中，但是这些函数里都是异步操作，想要按顺序执行，然后输出 1，2，3并没有那么简单，看个例子。


```
function A() {
    setTimeout(function () {
        console.log('a');
    }, 3000);
}

function B() {
    setTimeout(function () {
        console.log('b');
    }, 1000);
}

A();
B();

// b
// a
```
**答案**

```
// 保存数组中的函数执行后的结果
var data = [];

// Promise.resolve方法调用时不带参数，直接返回一个resolved状态的 Promise 对象。
var sequence = Promise.resolve();

ajaxArray.forEach(function (item) {
    // 第一次的 then 方法用来执行数组中的每个函数，
    // 第二次的 then 方法接受数组中的函数执行后返回的结果，
    // 并把结果添加到 data 中，然后把 data 返回。
    // 这里对 sequence 的重新赋值，其实是相当于延长了 Promise 链
    sequence = sequence.then(item).then(function (res) {
        data.push(res);
        return data;
    });
})

// 遍历结束后，返回一个 Promise，也就是 sequence， 他的 [[PromiseValue]] 值就是 data，
// 而 data（保存数组中的函数执行后的结果） 也会作为参数，传入下次调用的 then 方法中。
return sequence;
```

## 0.11. 第十一问：封装一个异步加载图片的方法


```js
function loadImageAsync(url) {
    return new Promise(function(resolve,reject) {
        var image = new Image();
        image.onload = function() {
            resolve(image) 
        };
        image.onerror = function() {
            reject(new Error('Could not load image at' + url));
        };
        image.src = url;
     });
}   
```

## 0.12. 第十二问：手写promise

请看我的另一篇文章
[一步一步实现自己的Promise](https://mp.weixin.qq.com/s?__biz=MzU5NDM5MDg1Mw==&tempkey=MTA1OV9Bb2RScjkyZ2NEb21iR0tvWU9WNGhzYUJLbmk2SlJwYUJIM0ZPM3pQbXJvRUVJUWgzYlpZMmNHT3ZPWURhelk4ck1zVkhFYWVTYUhyd01EaTVrd3hPNVFVRGlFSVk5ajBSdmE2cUo1bzgwQ2xiTHJxLVR5amZpdkh3NjFuRlRtMGx1NlhUZm5zUnUzQ3JIU09zaUJzMmdSVC0wNUwwd0twWG5ITGZBfn4%3D&chksm=7e00b9d2497730c424258da7d8dac063c0a3f1792a77dc241e7f72a682936ef5799e7f625747#rd)
