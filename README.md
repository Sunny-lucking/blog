【以下是我一边阅读《红宝书》《ES6入门标准》《高性能javascript》《javascript忍者秘籍》《JavaScript语言精粹》以及查阅网上资料，一边做的总结，欢迎补充与纠正】

# 一、关于【let const】十问

## 1.下面哪个会报错，为什么


```js
let a;
const a;
```


**答案：**

```js

let a; //不报错
const a; //报错
```

const 声明的常量不得改变值。这意味着， const 一旦声明常量，就必须立即初始化，不 能留到以后赋值

## 2. 如何在ES5环境下实现let

对于这个问题，我们可以直接查看babel转换前后的结果，看一下在循环中通过let定义的变量是如何解决变量提升的问题

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8zNGU3ODBjNi1jNzg2LTRhOTUtYjY4YS1hNWUzYjFkZGUwYmMucG5n?x-oss-process=image/format,png)



babel在let定义的变量前加了道下划线，避免在块级作用域外访问到该变量，除了对变量名的转换，我们也可以通过自执行函数来模拟块级作用域

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8wNjNkZDBmNC0yZjRiLTRhMjUtYWVkMy1kYWJkY2UxNDRhZTcucG5n?x-oss-process=image/format,png)



## 3. 如何在ES5环境下实现const

实现const的关键在于Object.defineProperty()这个API，这个API用于在一个对象上增加或修改属性。通过配置属性描述符，可以精确地控制属性行为。Object.defineProperty() 接收三个参数：

`Object.defineProperty(obj, prop, desc)`


![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9iOGJmZTc2My0xZGQ2LTRiNmEtODZjMC0zOTU4YTQxNmE1NjAucG5n?x-oss-process=image/format,png)


对于const不可修改的特性，我们通过设置writable属性来实现

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9hZTljMmJmOS00Yzk0LTQ1MTUtYTQwYS0yYWI5OTcwMzlmODAucG5n?x-oss-process=image/format,png)



## 4.const的本质是什么

const 实际上保证的并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。 对于简单类型的数据（数值、字符串、布尔值〉而言，值就保存在变量指向的内存地址中，因 此等同于常量。但对于复合类型的数据（主要是对象和数组）而言，变量指向的内存地址保存 的只是一个指针， const 只能保证这个指针是固定的，至于它指向的数据结构是不是可变的， 这完全不能控制。 因此，将一个对象声明为常量时必须非常小心。


![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9kY2QxZmVmZC1lZmRiLTQ0ZDktYmU0NS03NDUzMDhjMTljZDYucG5n?x-oss-process=image/format,png)


## 5.既然const不能保证 对象属性不被修改，那该怎么解决这个问题呢？

如果真的想将对象冻结，应该使用 Object.freeze 方法。

查看Object.freeze的用法与描述

Object.freeze()方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。


![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9jYzE1MTUwZi02YzVhLTQzNmItODBhOC04MmRlYTMyZDMyNzgucG5n?x-oss-process=image/format,png)


## 6.但是这样就能保证 对象冻结了吗？

不，因为Object.freeze()只能冻结基本数据类型的属性，若是属性还是引用类型的话，那就冻结不了了，因此，除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象彻底冻结的函数。


![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS83YTdjNDYzOC01ZTIxLTRhYTEtOTBjZC0wMmFjZjBkNjQ0YWEucG5n?x-oss-process=image/format,png)


## 7.既然你提到了Object.freeze，你能说下他的原理 吗

Object.freeze()的功能主要就是使对象属性冻结起来，这个功能跟 上面模拟const 类似，可以用Object.definedProperty()

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8yZTlkMDQzNS1jOWI0LTQ0MjktYTUxOC00NThmYjcyY2ZhODgucG5n?x-oss-process=image/format,png)

Object.definedProperty()方法可以定义对象的属性的特性。如可不可以删除、可不可以修改、访问这个属性的时候添油加醋等等。。 所以，我们可以这样写：



## 8.但是这样就完整了没，你有没有发现问题呢？

emmmmm，的确还有个问题，就是Object.definedProperty()只是设置了 对象的属性，也就是说，要是此时我使用 给对象添加属性，还是可以的，因此还有个问题要解决，就是使对象不能 添加新的属性，而要限制 拓展功能，我想到了Object.seal(),

查看Object.seal介绍:

**Object.seal()**方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变。


![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9lY2EwMjVkNC05MjY3LTQ4NzMtODliOS0zMjE3MWRkMGQ4ZDQucG5n?x-oss-process=image/format,png)


因此用Object.seal()和Object.definedProperty()就可以实现Object.freeze()


![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9lYjk3ZjI0YS1kMjg1LTQ3ODUtYWNlNS03Y2ZmNmRjNGI3YjAucG5n?x-oss-process=image/format,png)


## 9.ES6之前真的没有块级作用域吗？

可以看下这道题，答案是什么



![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8wMWNmN2NlMS1hNjNjLTQzZDItYWQ5MS0yOTBmODU2NjYzMzgucG5n?x-oss-process=image/format,png)



正确答案：内部是 21，外部是 1;

这个玄妙之处确实就在这个块级作用域 if 里面。

假如我们去掉 if 看题。

这道题估计没人好意思去问了，毫无疑问，输出的 a 都是 21 啊。

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS80NjIxYWU5Ny00YWQyLTRmYmItODUxNy1hYjY2NGQzYWY5NGIucG5n?x-oss-process=image/format,png)



实际上，首先，if 里面的 function a(){} 会声明提升，将声明" var a" 移到函数级作用域最前面，将函数定义移到块级作用域最前面，预解析如下：



![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS82YjI0MGQ3My1hZWYyLTQ3NDgtODFhZS1iOWJkZTcxMzRjNTAucG5n?x-oss-process=image/format,png)

函数本身是【 定义函数名变量 指针指向 函数内存块】。

函数提升是在块级作用域，但是函数名变量是函数级别的作用域。所以在块级的函数定义（原始代码函数的声明位置）的时候，会将函数名变量同步到函数级作用域，实际上，只有这个时候，在块级作用域外才能访问到函数定义。

预解析如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS81MTI4NzE0OC1iMTQ3LTRmNWMtOTlmYS0zMzIzMGFkZjlkMGMucG5n?x-oss-process=image/format,png)



[关于此题查看更多](https://mp.weixin.qq.com/s/MlKRNfK3blGJA7bfXzdsNg)

## 10.下面代码输出情况



![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS83MDMwMGRhNS03MDAwLTQyNDUtYjNkYi04Y2RmYThiZTlhNjEucG5n?x-oss-process=image/format,png)



![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9kMTYyNmEwMy02OTM0LTQwYTgtYmQzNS02NTFhZjlmZmI0MGIucG5n?x-oss-process=image/format,png)



可见在全局作用域中 var 声明的变量 会被挂载到 window中，而let 不会 而我在读一本关于es6书的时候 看到这一段话

ES6 将全局方法 parse!nt （）和 parseFloat （）移植到了 Number 对象上面，行为完全 >保持不变 这样做的目的是逐步减少全局性方法，使得语言逐步模块化。

是不是let 也想这样呢？当然这只是个人猜想，没什么理论依旧，您也不必往心里去

`补充：后来在书里看到这段，好像符合我的猜想`

顶层对象的属性与全局变量相关，被认为是 JavaScript 语言中最大的设计败笔之一。这样 的设计带来了几个很大的问题：首先，无法在编译时就提示变量未声明的错误，只有运行时才 能知道（因为全局变量可能是顶层对象的属性创造的，而属性的创造是动态的〉：其次，程序员 很容易不知不觉地就创建全局变量（比如打字出错〉：最后，顶层对象的属性是到处都可以读写 的，这非常不利于模块化编程。另一方面， window 对象有实体含义，指的是浏览器的窗口对 象，这样也是不合适的。

ES6 为了改变这一点， 一方面规定，为了保持兼容性， var 命令和 function 命令声明的 全局变量依旧是顶层对象的属性；另一方面规定， let 命令、 const 命令、 class 命令声明的 全局变量不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性 隔离。





# 二、关于【BOM】十问

## 第一问：请介绍BOM有哪些对象
>第一次被问到时，只知道window和navigator
1. window：BOM的核心对象是window对象，它表示浏览器的一个实例。
2. avigator：navigator 对象包含有关访问者浏览器的信息。

```html
<div id="example"></div>
<script>
  txt = "<p>浏览器代号: " + navigator.appCodeName + "</p>";
  txt+= "<p>浏览器名称: " + navigator.appName + "</p>";
  txt+= "<p>浏览器版本: " + navigator.appVersion + "</p>";
  txt+= "<p>启用Cookies: " + navigator.cookieEnabled + "</p>";
  txt+= "<p>硬件平台: " + navigator.platform + "</p>";
  txt+= "<p>用户代理: " + navigator.userAgent + "</p>";
  txt+= "<p>用户代理语言: " + navigator.systemLanguage + "</p>";
  document.getElementById("example").innerHTML=txt;
</script>

```
3. window.screen 对象包含有关用户屏幕的信息。

```html
<body>

<h3>你的屏幕:</h3>
<script>
  document.write("总宽度/高度: ");
  document.write(screen.width + "*" + screen.height);
  document.write("<br>");
  document.write("可用宽度/高度: ");
  document.write(screen.availWidth + "*" + screen.availHeight);
  document.write("<br>");
  document.write("色彩深度: ");
  document.write(screen.colorDepth);
  document.write("<br>");
  document.write("色彩分辨率: ");
  document.write(screen.pixelDepth);
</script>

</body>
```
4. location： 对象用于获得当前页面的地址 (URL)，并把浏览器重定向到新的页面。

一些实例:


```js
location.hostname 返回 web 主机的域名
location.pathname 返回当前页面的路径和文件名
location.port 返回 web 主机的端口 （80 或 443）
location.protocol 返回所使用的 web 协议（http: 或 https:）
location.assign(url) ： 加载 URL 指定的新的 HTML 文档。 就相当于一个链接，跳转到指定的url，当前页面会转为新页面内容，可以点击后退返回上一个页面。
location.replace(url) ： 通过加载 URL 指定的文档来替换当前文档 ，这个方法是替换当前窗口页面，前后两个页面共用一个窗口，所以是没有后退返回上一页的
```

5. history 对象包含浏览器的历史。

```js
history.go(0);  // go() 里面的参数为0,表示刷新页面
history.go(-1);  // go() 里面的参数表示跳转页面的个数 例如 history.go(-1) 表示后退一个页面
history.go(1);  // go() 里面的参数表示跳转页面的个数 例如 history.go(1) 表示前进一个页面
history.back() //方法加载历史列表中的前一个 URL。
history.forward() //方法加载历史列表中的下一个 URL。
```


## 第二问：以下代码都会输出什么呢？


```js
var age = 29;
window.color = "red";

delete window.age;

delete window.color;

alert(window.name)
alert(window.age)
alert(window.color)
```

答案：

```js
var age = 29;
window.color = "red";
// 在IE<9时抛出错误，在其他所有浏览器中都返回false
delete window.age;
// 在IE<9时抛出错误，在其他所有浏览器中都返回true
delete window.color;

alert(window.name) // ''
alert(window.age) //29
alert(window.color) //undefined
```
>使用var语句添加的window属性有一个名为[[configurable]]的特性，这个特性的值被设置为false，因此这样定义的属性不可以通过delete操作符删除.
window对象中本身就有个name属性，window.name 表示当前window的名称
age没被删除，所以输出29，而color被删除了。

## 第三问：你知道间接调用和超时调用吗？
   >javascript是单线程语言，但它允许通过设置超时值setTimeout和间歇时间值setInterval来调度代码在特定的时刻执行。前者是在指定的时间过后执行代码，而后者则是每隔指定的时间就执行一次代码。
   
  1. 超时调用使用window对象的setTimeout()方法，它接受两个参数：要执行的代码 和  以毫秒表示的时间。第一个参数可以是包含javascript语句的字符串（不推荐使用），也可以是函数。调用setTimeout()之后，该方法会返回一个数值ID，表示超时调用。
    
   
```
 // 推荐
 setTimeout(function(){
      alert("Hello");
  },1000);
  
  // 不推荐
  setTimeout("alert('Hello')",1000);
```

  2. 间歇调用与超时调用类似，只不过它会按照指定的时间间隔重复执行代码，直至间歇调用被取消或者页面被卸载。设置间歇调用的方法是setInterval()，它会接受的参数与setTimeout()相同：**因为在不加干涉的情况下，间歇调用将会一直执行到页面卸载。（ps:建议少用setInterval（），可以用setIimeout（）代替）**

## 第四问 你刚刚说建议少用setInterval（），可以用setIimeout（）代替，为什么呢？

对于这道题，要有 事件循环机制的只是储备，建议先看看：[这一次，彻底弄懂 JavaScript 执行机制（别还不知道什么是宏任务，什么是微任务）](https://mp.weixin.qq.com/s?__biz=MzU5NDM5MDg1Mw==&mid=2247483862&idx=1&sn=628b274a6828c9784cb10e1b53ccb952&chksm=fe00bbfcc97732ea5e5e7d2a77386a688e6aa15b9353c585d25204b27679eb84e77b81057ba6&token=749070603&lang=zh_CN#rd)

之所以说要替换，是因为setInterval的缺点
>再次强调，定时器指定的时间间隔，表示的是何时将定时器的代码添加到消息队列，而不是何时执行代码。所以真正何时执行代码的时间是不能保证的，取决于何时被主线程的事件循环取到，并执行。

```
setInterval(function, N)  
//即：每隔N秒把function事件推到消息队列中
```

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS80M2M3MzdlMi04OWYwLTQ3M2QtYmE2NS1jY2M0MzRmZGZiMzYucG5n?x-oss-process=image/format,png)

上图可见，setInterval每隔100ms往队列中添加一个事件；100ms后，添加T1定时器代码至队列中，主线程中还有任务在执行，所以等待，some event执行结束后执行T1定时器代码；又过了100ms，T2定时器被添加到队列中，主线程还在执行T1代码，所以等待；又过了100ms，理论上又要往队列里推一个定时器代码，但**由于此时T2还在队列中，所以T3不会被添加，结果就是此时被跳过**；**这里我们还可以看到，T1定时器执行结束后马上执行了T2代码，所以并没有达到定时器的效果**。

综上所述，setInterval有两个缺点：

- 使用setInterval时，某些间隔会被跳过；
- 可能多个定时器会连续执行；
可以这么理解：每个setTimeout产生的任务会直接push到任务队列中；而setInterval在每次把任务push到任务队列前，都要进行一下判断(看上次的任务是否仍在队列中)。

因而我们一般用setTimeout模拟setInterval，来规避掉上面的缺点。


## 第五问：既然如此那该怎么用setTimeout模拟setInterval呢

setTimeout模拟setInterval，也可理解为链式的setTimeout。

```
setTimeout(function () {
    // 任务
    setTimeout(arguments.callee, interval);
}, interval)

```
上述函数每次执行的时候都会创建一个新的定时器，第二个setTimeout使用了arguments.callee()获取当前函数的引用，并且为其设置另一个定时器。好处：
- 在前一个定时器执行完前，不会向队列插入新的定时器（解决缺点一）
- 保证定时器间隔（解决缺点二）

>警告：在严格模式下，第5版 ECMAScript (ES5) 禁止使用 arguments.callee()。当一个函数必须调用自身的时候, 避免使用 arguments.callee(), 通过要么给函数表达式一个名字,要么使用一个函数声明.

## 第六问：上面既然提到了hash和history，那就谈下两者的区别
**hash**

即地址栏 URL 中的 # 符号
hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。

**history**

利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法
它们执行修改时，虽然改变了当前的 URL，但浏览器不会立即向后端发送请求。
通过history api，我们丢掉了丑陋的#，但是它也有个问题：**不怕前进，不怕后退，就怕刷新，f5**，（如果后端没有准备的话）,因为刷新是实实在在地去请求服务器的。
在hash模式下，前端路由修改的是#中的信息，而浏览器请求时不会将 # 后面的数据发送到后台，所以没有问题。但是在history下，你可以自由的修改path，当刷新时，如果服务器中没有相应的响应或者资源，则会刷新出来404页面。



![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8zZWE5NTMyZi0zMjMxLTRiOGMtYjVjOS1hMDQzNjRlMDY2MDIucG5n?x-oss-process=image/format,png)
# 三、关于【ajax和json】十问
## 第一问：原生js写一个简单的ajax请求

>典型的xhr建立ajax的过程。（涵盖了ajax的大部分内容）
1. new一个xhr对象。（XMLHttpRequest或者ActiveXObject）
2. 调用xhr对象的open方法。
3. send一些数据。
4. 对服务器的响应过程进行监听，来知道服务器是否正确得做出了响应，接着就可以做一些事情。比如获取服务器响应的内容，在页面上进行呈现。


```js
//1、创建一个ajax对象 
var xhr = new XMLHttpRequest(); 

//3、绑定处理函数，我们写的代码，都在这里面 
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            console.log(xhr.responseText)
        } else {
            console.log("fail")
        }
    }
}

//2、进行初始化 
xhr.open('get','http://js.com/day6/ajax_get.php');


//4、发送请求
xhr.send(null);
```

**注意点：**
1. 如果不需要通过请求头发送数据，必须传入null
2. 为确保跨浏览器兼容性，建议`xhr.onreadystatechange`事件处理程序写在`xhr.open`前面
3. setRequestHeader必须写在`xhr.open`和`xhr.send(null)`之间


## 第二问：readyState各阶段的含义

0. 未初始化，但是已经创建了XHR实例
1. 调用了open()函数
2. 已经调用了send()函数，但还未收到服务器回应
3. 正在接受服务器返回的数据
4. 完成响应

## 第三问：怎么终止请求
再接收到响应之前还可以调用obort（）方法来取消异步请求

```
xhr.abort()
```
调用这个方法后，XHR对象会停止触发事件，而且也不再允许访问任何与响应有关的对象属性。在终止请求之后，还应该对XHR对象进行解引用操作。由于内存原因，不建议重用XHR对象


## 第四问：如何利用xhr做请求的进度条

>另一个革新是添加了progress事件，这个时间会在浏览器接受新数据期间周期性的触发，而onprogress事件处理程序会接收到一个event对象，其target属性是XHR对象，但包含着两个额外的属性：position和totalSize。其中position表示已经接受的字节数，totleSize表示根据Content-Length响应头部确定的预期字节数。




```
xhr.onprogress = function (event) {
    var divStatus = document.getElementById("status");
    divStatus.innerHTML = "Received" + event.position + "of" + event.totalSize + "bytes";
};
```

## 第五问：谈一下跨域

**1、JSONP跨域**：

jsonp的原理就是利用`<script>`标签没有跨域限制，通过`<script>`标签src属性，发送带有callback参数的GET请求，服务端将接口返回数据拼凑到callback函数中，返回给浏览器，浏览器解析执行，从而前端拿到callback函数返回的数据。


**2、跨域资源共享（CORS）**：

  CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制。

**浏览器将CORS跨域请求分为简单请求和非简单请求。**

只要同时满足一下两个条件，就属于简单请求

(1)使用下列方法之一：

- head
- get
- post

(2)请求的Heder是

- Accept
- Accept-Language
- Content-Language
- Content-Type: 只限于三个值：application/x-www-form-urlencoded、multipart/form-data、text/plain

不同时满足上面的两个条件，就属于非简单请求。浏览器对这两种的处理，是不一样的。

**简单请求**：

  对于简单请求，浏览器直接发出CORS请求。具体来说，就是在头信息之中，增加一个Origin字段。Origin字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。



**非简单请求**：

  非简单请求是那种对服务器有特殊要求的请求，比如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json。非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。

**预检请求**：

  预检"请求用的请求方法是OPTIONS，表示这个请求是用来询问的。请求头信息里面，关键字段是Origin，表示请求来自哪个源。除了Origin字段，"预检"请求的头信息包括两个特殊字段。

**3、nodejs中间服务器代理跨域**
利用本地服务器（跟前端项目同协议，同域名，同端口）来代理转发，利用的是同源策略是只发生在浏览器，而两个服务端是不会出现跨域问题的。

webpack种配置跨域就是这个原理。

webpack.config.js部分配置：

```js

module.exports = {
    entry: {},
    module: {},
    ...
    devServer: {
        historyApiFallback: true,
        proxy: [{
            context: '/login',
            target: 'http://www.domain2.com:8080',  // 代理跨域目标接口
            changeOrigin: true,
            secure: false,  // 当代理某些https服务报错时用
            cookieDomainRewrite: 'www.domain1.com'  // 可以为false，表示不修改
        }],
        noInfo: true
    }
}
```

**4、使用图片ping跨域**

　图像Ping跨域请求技术是使用<img>标签。一个网页可以从任何网页中加载图像，不用担心跨域不跨域。这也是在线广告跟踪浏览量的主要方式。也可以动态地创建图像，使用它们的 onload 和 onerror事件 处理程序来确定是否接收到了响应

　　动态创建图像经常用于图像Ping：图像Ping是与服务器进行简单、单向的跨域通信的一种方式。 请求的数据是通过査询字符串形式发送的，而响应可以是任意内容，但通常是像素图或204响应。通过图像Ping，浏览器得不到任何具体的数据，但通过侦听load和error事件，它能知道响应是什么时候接收到的
  
  `图像Ping有两个主要的缺点`，一是只能发送GET请求，二是无法访问服务器的响应文本。因此，图像Ping只能用于浏览器与服务器间的单向通信

## 第六问：JS跨域方案JSONP与CORS的各自优缺点以及应用场景？

两者优点与缺点大致互补，放在一块介绍：

JSONP的主要优势在于对浏览器的支持较好；虽然目前主流浏览器支持CORS，但IE10以下不支持CORS。

JSONP只能用于获取资源（即只读，类似于GET请求）；CORS支持所有类型的HTTP请求，功能完善。（这点JSONP被玩虐，但大部分情况下GET已经能满足需求了）

JSONP的错误处理机制并不完善，我们没办法进行错误处理；而CORS可以通过onerror事件监听错误，并且浏览器控制台会看到报错信息，利于排查。

JSONP只会发一次请求；而对于复杂请求，CORS会发两次请求。

始终觉得安全性这个东西是相对的，没有绝对的安全，也做不到绝对的安全。毕竟JSONP并不是跨域规范，它存在很明显的安全问题：callback参数注入和资源访问授权设置。CORS好歹也算是个跨域规范，在资源访问授权方面进行了限制（Access-Control-Allow-Origin），而且标准浏览器都做了安全限制，比如拒绝手动设置origin字段，相对来说是安全了一点。
但是回过头来看一下，就算是不安全的JSONP，我们依然可以在服务端端进行一些权限的限制，服务端和客户端也都依然可以做一些注入的安全处理，哪怕被攻克，它也只能读一些东西。就算是比较安全的CORS，同样可以在服务端设置出现漏洞或者不在浏览器的跨域限制环境下进行攻击，而且它不仅可以读，还可以写。

应用场景：

如果你需要兼容IE低版本浏览器，无疑，JSONP。

如果你需要对服务端资源进行谢操作，无疑，CORS。

其他情况的话，根据自己的对需求的分析和对两者的理解来吧。


## 第七问：我要是硬要用CORS方法解决跨域呢？有没办法兼容IE低版本
大部分浏览器都已经实现了CORS（跨域资源共享）的规范，IE低版本浏览器却无法支持这一规范。

在ie8,9中，有XDomainRequest对象可以实现跨域请求。可以和xhr一起使用。这个对象拥有onerror，onload，onprogress，ontimeout四个事件，abort，open，send三个方法，contentType， responseText，timeout三个属性。具体参见XDomainRequest对象。

XDomainRequest对象有很多限制，例如只支持get、post方法、不能自定义请求的header头、不能携带cookie、只支持text/plain类型的内容格式等等。具体参见XDomainRequest对象限制。

因此虽然XdomainRequest作为ie8、9中的一种跨域手段，但是适用的业务场景还是比较局限的。

## 第八问：json.stringify()与json.parse()的区别

json.stringfy()将对象、数组转换成字符串；json.parse()将字符串转成json对象。

**1.parse 用于从一个字符串中解析出json 对象**


```
var str='{"name":"TMD","sex":"男","age":"26"}';

console.log(JSON.parse(str));//{name: "TMD", sex: "男", age: "26"}
```


**2.stringify用于从一个对象解析出字符串**


```
var o={a:1,b:2,c:3};

console.log(JSON.stringify(o));//{"a":1,"b":2,"c":3}
```

## 第九问：json.stringify()用于实现深拷贝时有什么缺点呢？

**弊端：**

1.如果obj里面有时间对象，则JSON.stringify后再JSON.parse的结果，时间将只是字符串的形式，而不是对象的形式

2、如果obj里有函数，undefined，则序列化的结果会把函数或 undefined丢失；

3.如果obj里有RegExp(正则表达式的缩写)、Error对象，则序列化的结果将只得到空对象；

4、如果obj里有NaN、Infinity和-Infinity，则序列化的结果会变成null

5、JSON.stringify()只能序列化对象的可枚举的自有属性，例如 如果obj中的对象是有构造函数生成的， 则使用JSON.parse(JSON.stringify(obj))深拷贝后，会丢弃对象的constructor；

6、如果对象中存在循环引用的情况也无法正确实现深拷贝；

## 第十问：现在我要用json.stringify()用于实现深拷贝，而且对象里有undefined或者函数，Date，该怎么办呢？

查看文档，发现JSON.parse是可以传一个转换结果的函数的

　JSON.parse()方法也可以接收一个函数参数，在每个键值对儿上调用，这个函数被称为还原函数(reviver)。该函数接收两个参数，一个键和一个值，返回一个值

　　如果还原函数返回undefined，则表示要从结果中删除相应的键；如果返回其他值，则将该值插入到结果中

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS81ZGIxODA4NS03YzRjLTQwMTAtYmNmYy0zMzI1NWE0NDk3ODMucG5n?x-oss-process=image/format,png)
一次可以判断 key是不是Date，是的话就转化下
```js

var book = {
    "title": "javascript",
    "date": new Date(2016,9,1)
}
var jsonStr = JSON.stringify(book);
//'{"title":"javascript","date":"2016-09-30T16:00:00.000Z"}''
console.log(jsonStr)

var bookCopy = JSON.parse(jsonStr,function(key,value){
    if(key == 'date'){
        return new Date(value);
    }
    return value;
})
console.log(bookCopy.date.getFullYear());//2016
```


# 四、关于【script加载执行】十问



## 第一问：请说出关于下面使用方式中script的区别

**默认**
```html
<html>
<head>
  <script type="text/javascript" src="script1.js" ></script>
  <script type="text/javascript" src="script1.js" ></script>
</head>

<body>
</body>
</html>
```
**使用defer**
```html
<html>
<head>
  <script type="text/javascript" src="script1.js" defer="defer"></script>
  <script type="text/javascript" src="script2.js" defer="defer"></script>
</head>

<body>
</body>
</html>
```
**使用async**
```html
<html>
<head>
  <script type="text/javascript" src="script1.js" defer="async"></script>
  <script type="text/javascript" src="script2.js" defer="async"></script>
</head>

<body>
</body>
</html>
```

**默认方式**：浏览器会并行加载script, 但是执行是书写的顺序，如果script1执行未完毕，就不会开始执行script2,尽管script2已经加载完。
而且这种方式会阻碍script标签后面其他元素的渲染，直到script1执行完毕才会渲染后面的dom

**defer方式**：也叫**延迟脚本**，使用defer后，该脚本会被马上加载，但是脚本会被延迟到整个页面都解析完再执行，即等浏览器遇到`</html>`标签后在执行。并且这两个脚本会按顺序执行。

**async方式**：也叫**异步脚本：** ，使用async后，该脚本会被马上加载，加载完立即执行，但是不会影`响页面的解析`，。并且这两个脚本不会按顺序执行。谁先加载完，谁就先执行

## 第二问：第一种方式中script是并行下载的吗？

是的，大多数浏览器现在已经允许并行下载JavaScript文件。这是个好消息，因为`<script>`标签在下载外部资源时不会阻塞其他`<script>`标签。遗憾的是，JavaScript 下载过程仍然会阻塞其他资源的下载，比如样式文件和图片（http连接个数的限制，当然，这个原因通常可以用减少http请求来解决，就是合并JavaScript脚本）。尽管脚本的下载过程不会互相影响，但页面仍然必须等待所有 JavaScript 代码下载并执行完成才能继续。因此，尽管最新的浏览器通过允许并行下载提高了性能，但问题尚未完全解决，脚本阻塞仍然是一个问题。

## 第三问：为什么script脚本要放在body尾部，而不放在head里。

若在head元素中包含js文件，意味着必须等js代码都被下载，解析，执行后才能开始呈现页面（浏览器在遇到`<body>`标签时才开始呈现页面）

## 第四问：那我硬是要放在head呢？怎么解决（除了用defer，async）

**动态脚本加载**: 时可以用另外一种方式加载脚本，叫做`动态脚本加载`。

文档对象模型（DOM）允许您使用 JavaScript 动态创建 HTML 的几乎全部文档内容。`<script>`元素与页面其他元素一样，可以非常容易地通过标准 DOM 函数创建：
  
 
```
  通过标准 DOM 函数创建`<script>`元素
  var script = document.createElement ("script");
   script.type = "text/javascript";
   script.src = "script1.js";
   document.getElementsByTagName("head")[0].appendChild(script);
```

新的`<script>`元素加载 script1.js 源文件。此文件当元素添加到页面之后立刻开始下载。此技术的重点在于：无论在何处启动下载，文件的下载和运行都不会阻塞其他页面处理过程。您甚至可以将这些代码放在`<head>`部分而不会对其余部分的页面代码造成影响（除了用于下载文件的 HTTP 连接）。

当文件使用动态脚本节点下载时，返回的代码通常立即执行（除了 Firefox 和 Opera，他们将等待此前的所有动态脚本节点执行完毕）。

**XMLHttpRequest脚本注入**

另外一种无阻塞加载的脚本方法是使用XMLHttpRequest对象获取脚本并注入页面中。此技术会先创建一个XHR对象，然后用它下载JS文件，最后通过创建动态`<script>`元素将代码注入页面中。

```
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    }
  }
xmlhttp.open("GET","test.js",true);
xmlhttp.send();
}
```

这段代码发送一个GET请求获取test.js文件。事件处理函数onReadyStateChange检查readyState是否为4，同时校验HTTP状态码是否有效(200表示有效响应，304意味着从缓存中读取)。

这种方法主要优点是:你可以下载JS代码但不立即执行。由于代码是在`<script>`标签之外返回的，因此它下载后不会自动执行，这使得你可以把脚本的执行推行到你准备好的时候。另一个优点是，同样的代码再所有的主流浏览器中无一例外都能正常工作。

这种方法的主要局限性是JS文件必须与所请求的页面处于相同的域，这意味着JS文件不能从CDN下载。因此大型Web应用通常不会采用XHR脚本注入。

>当不是引入外部脚本时可以用window.load或$('document').ready来使JavaScript等页面加载完再执行




## 第五问：那我该怎么知道动态脚本已经加载完毕了呢

我们可以对加载的 JS 对象使用 onload 来判断（js.onload），此方法 Firefox2、Firefox3、Safari3.1+、Opera9.6+ 浏览器都能很好的支持，但 IE6、IE7 却不支持。曲线救国 —— IE6、IE7 我们可以使用 js.onreadystatechange 来跟踪每个状态变化的情况（一般为 loading 、loaded、interactive、complete），当返回状态为 loaded 或 complete 时，则表示加载完成，返回回调函数。

对于 readyState 状态需要一个补充说明：

1. 在 interactive 状态下，用户可以参与互动。
2. Opera 其实也支持 js.onreadystatechange，但他的状态和 IE 的有很大差别。



```js
<script>
function include_js(file) {
    var _doc = document.getElementsByTagName('head')[0];
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', file);
    _doc.appendChild(js);
    if (!/*@cc_on!@*/0) { //if not IE
        //Firefox2、Firefox3、Safari3.1+、Opera9.6+ support js.onload
        js.onload = function () {
            alert('Firefox2、Firefox3、Safari3.1+、Opera9.6+ support js.onload');
        }
    } else {
        //IE6、IE7 support js.onreadystatechange
        js.onreadystatechange = function () {
            if (js.readyState == 'loaded' || js.readyState == 'complete') {
                alert('IE6、IE7 support js.onreadystatechange');
            }
        }
    }
    return false;
}

include_js('http://www.planabc.net/wp-includes/js/jquery/jquery.js');
</script>

```

## 第六问：动态加载的脚本会按顺序执行吗？怎么解决？
浏览器不保证文件加载的顺序。所有主流浏览器之中，只有 Firefox 和 Opera 保证脚本按照你指定的顺序执行。其他浏览器将按照服务器返回它们的次序下载并运行不同的代码文件。
解决方法：一个一个按顺序加载。加载完1.js，再加载2.js，如代码：


```js
function loadScript(){
	var scriptArr =  Array.prototype.slice.apply(arguments);
	var script = document.createElement('script');
	script.type = 'text/javascript'; 
	
	var rest = scriptArr.slice(1);

	if(rest.length > 0){
		script.onload = script.onreadystatechange = function() { 
			if ( !this.readyState || this.readyState === "loaded" || 
			this.readyState === "complete" ) { 
				loadScript.apply(null, rest); 
				// Handle memory leak in IE 
				script.onload = script.onreadystatechange = null; 
			} 
		}; 	
	}					

	script.src = scriptArr[0];
	document.body.appendChild(script);
}	
loadScript('1.js','2.js','3.js');
```



## 第七问：有见过`noscript`标签吗？知道是干嘛用的吗？

  如果浏览器不支持支持脚本，那么它会显示出 noscript 元素中的文本。
  
  

```html
  
  <body>
  ...
  ...
  <script type="text/vbscript">
   <!--
   document.write("Hello World!")
   '-->
  </script>
  
  <noscript>Your browser does not support VBScript!</noscript>
  ...
  ...
</body>
```






总结
减少 JavaScript 对性能的影响有以下几种方法：

- 将所有的`<script>`标签放到页面底部，也就是`</body>`闭合标签之前，这能确保在脚本执行前页面已经完成了渲染。
- 尽可能地合并脚本。页面中的`<script>`标签越少，加载也就越快，响应也越迅速。无论是外链脚本还是内嵌脚本都是如此。
- 采用无阻塞下载 JavaScript 脚本的方法：
- 使用`<script>`标签的 defer 属性（仅适用于 IE 和 Firefox 3.5 以上版本）；
- 使用动态创建的`<script>`元素来下载并执行代码；
- 使用 XHR 对象下载 JavaScript 代码并注入页面中。
通过以上策略，可以在很大程度上提高那些需要使用大量 JavaScript 的 Web 网站和应用的实际性能。
  
该模块后续补充，也欢迎大家补充


看高性能js这本书时，有一段话让我很不解他想表达什么意思，如下，既然是放在body底部了为什么还要**动态加载**？（我的理解：这描述的应该是懒加载，**动态加载，你不需要就可以先不加载**，
欢迎交流）
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9kYWNlN2MwNC1hNGVhLTRhYzktODQ0My0yZGFlNDM3ZjljYmYucG5n?x-oss-process=image/format,png)



# 五、关于【原型与继承】十问

## 第一问：你知道new操作符的实现原理吗？描述下


通过new创建对象经历4个步骤：

- 1、创建一个新对象
- 2、将构造函数的作用域赋给新对象（因此this指向了这个新对象）
- 3、执行构造函数中的代码(为这个新对象添加属性)；
- 4、返回新对象。

```
function newFunc (name) {
    var o = {};
    o.__proto__ = Person.prototype;//绑定Person的原型
    Person.call(o, name);
    return o;
}

```



## 第二问：请问下面代码输出什么？


```
function Person(){}
var p1 = new Person()

console.log(p1.constructor)
Person.prototype = {
    name:"小红"
}
var p2 = new Person()
console.log(p2.constructor)
```

答案：

```
function Person(){}
var p1 = new Person()

console.log(p1.constructor) // [Function: Person]
Person.prototype = {
    name:"小红"
}
var p2 = new Person()
console.log(p2.constructor)  [Function: Object]
```

## 第三问：为什么输出的两个constructor不相同

无论什么时候，只要创建了一个新函数，就会根据一组特定的规则，为该函数创建一个prototype属性，这个属性指向函数的原型对象。在默认情况下，所有原型对象都会自动获得一个constructor属性，这个属性指向了prototype所在的函数。
上面的体题中

打印`p1.constructor`时，p1没有`constructor`属性，于是就往原型链查找，就在Person.prototype上找到了有`constructor`，而这个`constructor`指向构造函数Person，因此，打印出`[Function: Person]`。

而到p2时，`Person.prototype`的值已经被修改成{
    name:"小红"
}，发现这个值里已经没有constructor，但是prototype上必须有constructor，所以它就自己创建了constructor，并且默认指向Object.,所以打印`[Function: Object]`。


## 第四问：如果我修改prototype时，仍想constructor依旧指向Person，该怎么做呢？

如果想constructor依旧指向Person，可以在修改prototype的时候，添加上construtor属性

```js
function Person(){}
var p1 = new Person()
console.log(p1.constructor) //[Function: Person]
Person.prototype = {
    constructor: Person,
    name:"小红"
}
var p2 = new Person()
console.log(p2.constructor) //[Function: Person]
```


但是这种添加constructor属性，会导致它的[[Enumerable]]特性的值被设置为true，所以可以用下面这种方式

```js
function Person(){}
var p1 = new Person()
console.log(p1.constructor)  //[Function: Person]
Person.prototype = {
    name:"小红"
}
Object.defineProperty(Person.prototype,"constructor",{
    enumerable: false,
    value: Person
})

var p2 = new Person()
console.log(p2.constructor)  //[Function: Person]
```


## 第五问：你能介绍下原型链继承吗？



```js
// 实现原型链的一种基本模式
function SuperType(){
    this.property = true;
}
SuperType.prototype.getSuperValue = function(){
    return this.property;
};
function SubType(){
    this.subproperty = false;
}

// 继承，用 SuperType 类型的一个实例来重写 SubType 类型的原型对象
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function(){
     return this.subproperty;
};
var instance = new SubType();
alert(instance.getSuperValue());     // true
```

其中，SubType 继承了 SuperType，而继承是通过创建 SuperType 的实例，并将该实例赋值给 SubType 的原型实现的。

实现的本质是重写子类型的原型对象，代之以一个新类型的实例。子类型的新原型对象中有一个内部属性 `Prototype` 指向了 SuperType 的原型，还有一个从 SuperType 原型中继承过来的属性 constructor 指向了 SuperType 构造函数。

最终的原型链是这样的：instance 指向 SubType 的原型，SubType 的原型又指向 SuperType 的原型，SuperType 的原型又指向 Object 的原型（所有函数的默认原型都是 Object 的实例，因此默认原型都会包含一个内部指针，指向 Object.prototype）
**原型链继承的缺点：**

1、在通过原型来实现继承时，原型实际上会变成另一个类型的实例。于是，原先的实例属性也就顺理成章地变成了现在的原型属性，并且会被所有的实例**共享**。这样理解：在超类型构造函数中定义的引用类型值的实例属性，会在子类型原型上变成原型属性被所有子类型实例所共享
2、在创建子类型的实例时，不能向超类型的构造函数中**传递参数**

## 第六问：既然原型链继承有以上缺点，那有没有解决方法呢？
有，就是借用构造函数继承

借用构造函数继承（也称伪造对象或经典继承）



```js
// 在子类型构造函数的内部调用超类型构造函数；使用 apply() 或 call() 方法将父对象的构造函数绑定在子对象上
function SuperType(){
    // 定义引用类型值属性
    this.colors = ["red","green","blue"];
}
function SubType(){
    // 继承 SuperType，在这里还可以给超类型构造函数传参
    SuperType.call(this);
}
var instance1 = new SubType();
instance1.colors.push("purple");
alert(instance1.colors);     // "red,green,blue,purple"

var instance2 = new SubType();
alert(instance2.colors);     // "red,green,blue"
```


通过使用 apply() 或 call() 方法，我们实际上是在将要创建的 SubType 实例的环境下调用了 SuperType 构造函数。这样一来，就会在新 SubType 对象上执行 SuperType() 函数中定义的所有对象初始化代码。结果 SubType 的每个实例就都会具有自己的 colors 属性的副本了
。
借用构造函数的优点是解决了原型链实现继承存在的两个问题。
但是一波已平，一波又起

借用构造函数的**缺点**是方法都在构造函数中定义，因此函数复用就无法实现了。而且，在超类型的原型中定义的方法，对子类型而言也是不可见的，结果所有类型都只能使用构造函数模式。

## 第六问：既然原型链继承和借用构造函数都有缺点，那该怎么办？

既然两种方法都没有对方的缺点，那就可以把两者方法结合起来，就解决了，这种方法叫做`组合继承`，

组合继承（也称伪经典继承）

>将原型链和借用构造函数的技术组合到一块。使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又能够保证每个实例都有自己的属性。



```js
function SuperType(name){
    this.name = name;
    this.colors = ["red","green","blue"];
}
SuperType.prototype.sayName = function(){
    alert(this.name);
};
function SubType(name,age){
    // 借用构造函数方式继承属性
    SuperType.call(this,name);
    this.age = age;
}
// 原型链方式继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
    alert(this.age);
};
var instance1 = new SubType("luochen",22);
instance1.colors.push("purple");
alert(instance1.colors);      // "red,green,blue,purple"
instance1.sayName();
instance1.sayAge();

var instance2 = new SubType("tom",34);
alert(instance2.colors);      // "red,green,blue"
instance2.sayName();
instance2.sayAge();
```

组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，成为 javascript 中最常用的继承模式。而且，使用 instanceof 操作符和 isPrototype() 方法也能够用于识别基于组合继承创建的对象。

但它也有自己的不足 -- **无论在什么情况下，都会调用两次超类型构造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。**

## 第七问：怎么还有缺点，再介绍下其他的继承方法？

**原型式继承**
 
 借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。
 自定义一个函数来实现原型式继承



```js
function object(o){
            function F(){}
            F.prototype = o;
            return new F();
}
```
在 object() 函数内部，先创建一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回这个临时类型的一个新实例。实质上，object() 对传入其中的对象执行了一次浅复制。
其实这个方法就是Object.create的简单实现

**直接用`Object.create`实现原型式继承**

这个方法接收两个参数：一是用作新对象原型的对象和一个为新对象定义额外属性的对象。在传入一个参数的情况下，此方法与 object() 方法作用一致。在传入第二个参数的情况下，指定的任何属性都会覆盖原型对象上的同名属性。



```js
var person = {
            name: "luochen",
            colors: ["red","green","blue"]
};
var anotherPerson1 = Object.create(person,{
            name: {
                    value: "tom"
            }
});
var anotherPerson2 = Object.create(person,{
            name: {
                    value: "jerry"
            }
});
anotherPerson1.colors.push("purple");
alert(anotherPerson1.name);     // "tom"
alert(anotherPerson2.name);     // "jerry"
alert(anotherPerson1.colors);    // "red,green,blue,purple"
alert(anotherPerson2.colors);    // "red,green,bule,purple";
```
只是想让一个对象与另一个对象类似的情况下，原型式继承是完全可以胜任的。但是缺点是：`包含引用类型值的属性始终都会共享相应的值`，这也是原型链继承的缺点

**寄生式继承**

 
创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后返回这个对象

```js
function createPerson(original){
    var clone = Object.create(original);   // 通过 Object.create() 函数创建一个新对象
    clone.sayGood = function(){   // 增强这个对象
         alert("hello world！！！");
    };
    return clone; // 返回这个对象
}

```
这个方式跟工厂模式生产对象很类似。在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。此模式的缺点是做不到函数复用

**寄生组合式继承**

通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型


```js
function SuperType(name){
}

function SubType(name,age){
    SuperType.call(this,name);
    this.age = age;
}
// 创建超类型原型的一个副本
var anotherPrototype = Object.create(SuperType.prototype);
// 重设因重写原型而失去的默认的 constructor 属性
anotherPrototype.constructor = SubType;
// 将新创建的对象赋值给子类型的原型
SubType.prototype = anotherPrototype;
```
这个例子的高效率体现在它只调用一次 SuperType 构造函数，并且因此避免了在 SubType.prototype 上面创建不必要，多余的属性。与此同时，原型链还能保持不变；因此还能够正常使用 instance 操作符和 isPrototype() 方法
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8zZWE5NTMyZi0zMjMxLTRiOGMtYjVjOS1hMDQzNjRlMDY2MDIucG5n?x-oss-process=image/format,png)


# 六、关于【高级技巧】十问


## 第一问：安全类型检测——typeof和instanceof 区别以及缺陷，以及解决方案

这两个方法都可以用来判断变量类型

**区别**：前者是判断这个变量是什么类型，后者是判断这个变量是不是某种类型，返回的是布尔值

（1）typeof  

**缺陷：**

1.不能判断变量具体的数据类型比如数组、正则、日期、对象，因为都会返回object,不过可以判断function，如果检测对象是正则表达式的时候,在Safari和Chrome中使用typeof的时候会错误的返回"function",其他的浏览器返回的是object.

2.判断null的时候返回的是一个object，这是js的一个缺陷,判断NaN的时候返回是number

（2）instanceof
可以用来检测这个变量是否为某种类型，返回的是布尔值，并且可以判断这个变量是否为某个函数的实例，它检测的是对象的原型

```

let num = 1
num instanceof Number // false

num = new Number(1)
num instanceof Number // true
```

明明都是num，而且都是1，只是因为第一个不是对象，是基本类型，所以直接返回false，而第二个是封装成对象，所以true。

这里要严格注意这个问题，有些说法是检测目标的__proto__与构造函数的prototype相同即返回true，这是不严谨的，检测的一定要是对象才行，如：


```
let num = 1
num.__proto__ === Number.prototype // true
num instanceof Number // false

num = new Number(1)
num.__proto__ === Number.prototype // true
num instanceof Number // true

num.__proto__ === (new Number(1)).__proto__ // true
```

此外，instanceof还有另外一个缺点：如果一个页面上有多个框架，即有多个全局环境，那么我在a框架里定义一个Array，然后在b框架里去用instanceof去判断，那么该array的原型链上不可能找到b框架里的array，则会判断该array不是一个array。

**解决方案**：使用Object.prototype.toString.call(value) 方法去调用对象，得到对象的构造函数名。可以解决instanceof的跨框架问题，缺点是对用户自定义的类型，它只会返回[object Object]

## 第二问：既然提到了instanceof，那手写实现下instanceof吧



```js
// [1,2,3] instanceof Array ---- true

// L instanceof R
// 变量R的原型 存在于 变量L的原型链上
function instance_of(L,R){    
    // 验证如果为基本数据类型，就直接返回false
    const baseType = ['string', 'number','boolean','undefined','symbol']
    if(baseType.includes(typeof(L))) { return false }
    
    let RP  = R.prototype;  //取 R 的显示原型
    L = L.__proto__;       //取 L 的隐式原型
    while(true){           // 无线循环的写法（也可以使 for(;;) ）
        if(L === null){    //找到最顶层
            return false;
        }
        if(L === RP){       //严格相等
            return true;
        }
        L = L.__proto__;  //没找到继续向上一层原型链查找
    }
}
```


## 第三问：作用域安全的构造函数--当我们new一个构造函数的时候可以获得一个实例，要是我们忘记写new了呢？

例如

```
function Person(){
    this.name = "小红"
}

p = Person();
```
**这会发生什么问题？，怎么解决**


这样直接使用，this会映射到全局对象window上。解决方法可以是：首先确认this对象是正确类型的实例。如果不是，那么会创建新的实例并返回。请看下面的例子


```
function Person(){
    if(this instanceof Person){
        this.name = "小红"
    }else{
        return  new Person()
    }
}

p = Person();

```




## 第四问：谈一下惰性载入函数

在JavaScript代码中，由于浏览器之间行为的差异，多数JavaScript代码包含了大量的if语句，以检查浏览器特性，解决不同浏览器的兼容问题。例如添加事件的函数：


```
function addEvent (element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
    } else {
        element["on" + type] = handler;
    }
}

```

每次调用addEvent()的时候，都要对浏览器所支持的能力仔细检查。首先检查是否支持addEventListener方法，如果不支持再检查是否支持attachEvent方法，如果还不支持，就用DOM 0级的方法添加事件。在调用addEvent()过程中，每次这个过程都要走一遍。其实，浏览器支持其中的一种方法就会一直支持他，就没有必要再进行其他分支的检测了，也就是说if语句不必每次都执行，代码可以运行的更快一些。解决的方案称之为惰性载入。
所谓惰性载入，就是说函数的if分支只会执行一次，之后调用函数时，直接进入所支持的分支代码。有两种实现惰性载入的方式，第一种事函数在第一次调用时，对函数本身进行二次处理，该函数会被覆盖为符合分支条件的函数，这样对原函数的调用就不用再经过执行的分支了，我们可以用下面的方式使用惰性载入重写addEvent()。


```

function addEvent (type, element, handler) {
    if (element.addEventListener) {
        addEvent = function (type, element, handler) {
            element.addEventListener(type, handler, false);
        }
    }
    else if(element.attachEvent){
        addEvent = function (type, element, handler) {
            element.attachEvent('on' + type, handler);
        }
    }
    else{
        addEvent = function (type, element, handler) {
            element['on' + type] = handler;
        }
    }
    return addEvent(type, element, handler);
}
```
在这个惰性载入的addEvent()中，if语句的每个分支都会为addEvent变量赋值，有效覆盖了原函数。最后一步便是调用了新赋函数。下一次调用addEvent()的时候，便会直接调用新赋值的函数，这样就不用再执行if语句了。

第二种实现惰性载入的方式是在声明函数时就指定适当的函数。这样在第一次调用函数时就不会损失性能了，只在代码加载时会损失一点性能。一下就是按照这一思路重写的addEvent()。


```
var addEvent = (function () {
    if (document.addEventListener) {
        return function (type, element, fun) {
            element.addEventListener(type, fun, false);
        }
    }
    else if (document.attachEvent) {
        return function (type, element, fun) {
            element.attachEvent('on' + type, fun);
        }
    }
    else {
        return function (type, element, fun) {
            element['on' + type] = fun;
        }
    }
})();
```


这个例子中使用的技巧是创建一个匿名的自执行函数，通过不同的分支以确定应该使用那个函数实现，实际的逻辑都一样，不一样的地方就是使用了函数表达式（使用了var定义函数）和新增了一个匿名函数，另外每个分支都返回一个正确的函数，并立即将其赋值给变量addEvent。

惰性载入函数的优点只执行一次if分支，避免了函数每次执行时候都要执行if分支和不必要的代码，因此提升了代码性能，至于那种方式更合适，就要看您的需求而定了。

## 第五问：谈一下函数节流


**概念**：限制一个函数在一定时间内只能执行一次。

**主要实现思路** 就是通过 setTimeout 定时器，通过设置延时时间，在第一次调用时，创建定时器，先设定一个变量true，写入需要执行的函数。第二次执行这个函数时，会判断变量是否true，是则返回。当第一次的定时器执行完函数最后会设定变量为false。那么下次判断变量时则为false，函数会依次运行。目的在于在一定的时间内，保证多次函数的请求只执行最后一次调用。

**函数节流的代码实现**

```
function throttle(fn,wait){
    var timer = null;
    return function(){
        var context = this;
        var args = arguments;
        if(!timer){
            timer = setTimeout(function(){
                fn.apply(context,args);
                timer = null;
            },wait)
        }
    }
}
    
function handle(){
    console.log(Math.random());
}
    
window.addEventListener("mousemove",throttle(handle,1000));
```

**函数节流的应用场景(throttle)**

- DOM 元素的拖拽功能实现（mousemove）
- 高频点击提交，表单重复提交
- 搜索联想（keyup）
- 计算鼠标移动的距离（mousemove）
- 监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断
- 射击游戏的 mousedown/keydown 事件（单位时间只能发射一颗子弹）
- 监听滚动事件判断是否到页面底部自动加载更多：给 scroll 加了 debounce 后，只有用户停止滚动后，- - 才会判断是否到了页面底部；如果是 throttle 的话，只要页面滚动就会间隔一段时间判断一次.
## 第六问：谈一下函数防抖


**概念**：函数防抖（debounce），就是指触发事件后，在 n 秒内函数只能执行一次，如果触发事件后在 n 秒内又触发了事件，则会重新计算函数延执行时间。

**函数防抖的要点**，是需要一个 setTimeout 来辅助实现，延迟运行需要执行的代码。如果方法多次触发，则把上次记录的延迟执行代码用 clearTimeout 清掉，重新开始计时。若计时期间事件没有被重新触发，等延迟时间计时完毕，则执行目标代码。


**函数防抖的代码实现**


```js
function debounce(fn,wait){
    var timer = null;
    return function(){
        if(timer !== null){
            clearTimeout(timer);
        }
        timer = setTimeout(fn,wait);
    }
}
    
function handle(){
    console.log(Math.random());
}
    
window.addEventListener("resize",debounce(handle,1000));
```
**函数防抖的使用场景**
函数防抖一般用在什么情况之下呢？一般用在，连续的事件只需触发一次回调的场合。具体有：

- 搜索框搜索输入。只需用户最后一次输入完，再发送请求；
- 用户名、手机号、邮箱输入验证；
- 浏览器窗口大小改变后，只需窗口调整完后，再执行 resize 事件中的代码，防止重复渲染。

目前遇到过的用处就是这些，理解了原理与实现思路，小伙伴可以把它运用在任何需要的场合，提高代码质量。

## 第七问：谈一下requestAnimationFrame

**动画原理** ：
眼前所看到图像正在以每秒60次的频率刷新，由于刷新频率很高，因此你感觉不到它在刷新。而动画本质就是要让人眼看到图像被刷新而引起变化的视觉效果，这个变化要以连贯的、平滑的方式进行过渡。 那怎么样才能做到这种效果呢？

刷新频率为60Hz的屏幕每16.7ms刷新一次，我们在屏幕每次刷新前，将图像的位置向左移动一个像素，即1px。这样一来，屏幕每次刷出来的图像位置都比前一个要差1px，因此你会看到图像在移动；由于我们人眼的视觉停留效应，当前位置的图像停留在大脑的印象还没消失，紧接着图像又被移到了下一个位置，因此你才会看到图像在流畅的移动，这就是视觉效果上形成的动画。

**与setTimeout相比较**：

理解了上面的概念以后，我们不难发现，setTimeout 其实就是通过设置一个间隔时间来不断的改变图像的位置，从而达到动画效果的。但我们会发现，利用seTimeout实现的动画在某些低端机上会出现卡顿、抖动的现象。 这种现象的产生有两个原因：

- setTimeout的执行时间并不是确定的。在Javascript中， setTimeout 任务被放进了异步队列中，只有当主线程上的任务执行完以后，才会去检查该队列里的任务是否需要开始执行，因此 setTimeout 的实际执行时间一般要比其设定的时间晚一些。

- 刷新频率受屏幕分辨率和屏幕尺寸的影响，因此不同设备的屏幕刷新频率可能会不同，而 setTimeout只能设置一个固定的时间间隔，这个时间不一定和屏幕的刷新时间相同。



以上两种情况都会导致setTimeout的执行步调和屏幕的刷新步调不一致，从而引起丢帧现象

**requestAnimationFrame**：与setTimeout相比，requestAnimationFrame最大的优势是由系统来决定回调函数的执行时机。具体一点讲，如果屏幕刷新率是60Hz,那么回调函数就每16.7ms被执行一次，如果刷新率是75Hz，那么这个时间间隔就变成了1000/75=13.3ms，换句话说就是，requestAnimationFrame的步伐跟着系统的刷新步伐走。它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。

除此之外，requestAnimationFrame还有以下两个优势：

- CPU节能：使用setTimeout实现的动画，当页面被隐藏或最小化时，setTimeout 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费CPU资源。而requestAnimationFrame则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂停，因此跟着系统步伐走的requestAnimationFrame也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了CPU开销。

- 函数节流：在高频率事件(resize,scroll等)中，为了防止在一个刷新间隔内发生多次函数执行，使用requestAnimationFrame可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销。一个刷新间隔内函数执行多次时没有意义的，因为显示器每16.7ms刷新一次，多次绘制并不会在屏幕上体现出来。

## 第八问：web计时，你知道该怎么计算首屏，白屏时间吗？

**白屏时间**：
白屏时间指的是浏览器开始显示内容的时间。因此我们只需要知道是浏览器开始显示内容的时间点，即页面白屏结束时间点即可获取到页面的白屏时间。
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8wYjAzMmVhNy1hNWIyLTQ2YjItOTBiNi1kYjI4MmYxYjViY2UucG5n?x-oss-process=image/format,png)

**计算白屏时间**
因此，我们通常认为浏览器开始渲染 <body> 标签或者解析完 <head> 标签的时刻就是页面白屏结束的时间点。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>白屏</title>
  <script type="text/javascript">
    // 不兼容performance.timing 的浏览器，如IE8
    window.pageStartTime = Date.now();
  </script>
  <!-- 页面 CSS 资源 -->
  <link rel="stylesheet" href="common.css">
  <link rel="stylesheet" href="page.css">
  <script type="text/javascript">
    // 白屏时间结束点
    window.firstPaint = Date.now();
  </script>
</head>
<body>
  <!-- 页面内容 -->
</body>
</html>
```
**因此白屏时间则可以这样计算出：**

`可使用 Performance API 时`:
  
白屏时间 = firstPaint - performance.timing.navigationStart;

`不可使用 Performance API 时`:
  
白屏时间 = firstPaint - pageStartTime; //虽然我们知道这并不准确，毕竟DNS解析，tcp三次握手等都没计算入内。
  
  
  **首屏时间**：
首屏时间是指用户打开网站开始，到浏览器首屏内容渲染完成的时间。对于用户体验来说，首屏时间是用户对一个网站的重要体验因素。通常一个网站，如果首屏时间在5秒以内是比较优秀的，10秒以内是可以接受的，10秒以上就不可容忍了。超过10秒的首屏时间用户会选择刷新页面或立刻离开。
  
  
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8yYWFjMDE2MC01NjQ2LTRiY2UtOWY0YS1kNTdjODE1YjRlZmQucG5n?x-oss-process=image/format,png)
通常计算首屏的方法有

- 首屏模块标签标记法
- 统计首屏内加载最慢的图片的时间
- 自定义首屏内容计算法
  
  **1、首屏模块标签标记法**
  
首屏模块标签标记法，通常适用于首屏内容不需要通过拉取数据才能生存以及页面不考虑图片等资源加载的情况。我们会在 HTML 文档中对应首屏内容的标签结束位置，使用内联的 JavaScript 代码记录当前时间戳。如下所示：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>首屏</title>
  <script type="text/javascript">
    window.pageStartTime = Date.now();
  </script>
  <link rel="stylesheet" href="common.css">
  <link rel="stylesheet" href="page.css">
</head>
<body>
  <!-- 首屏可见模块1 -->
  <div class="module-1"></div>
  <!-- 首屏可见模块2 -->
  <div class="module-2"></div>
  <script type="text/javascript">
    window.firstScreen = Date.now();
  </script>
  <!-- 首屏不可见模块3 -->
  <div class="module-3"></div>
    <!-- 首屏不可见模块4 -->
  <div class="module-4"></div>
</body>
</html>
```
**此时首屏时间等**于 firstScreen - performance.timing.navigationStart;

事实上首屏模块标签标记法 在业务中的情况比较少，大多数页面都需要通过接口拉取数据才能完整展示，因此我们会使用 JavaScript 脚本来判断首屏页面内容加载情况。

**2、统计首屏内图片完成加载的时间**
  
通常我们首屏内容加载最慢的就是图片资源，因此我们会把首屏内加载最慢的图片的时间当做首屏的时间。

由于浏览器对每个页面的 TCP 连接数有限制，使得并不是所有图片都能立刻开始下载和显示。因此我们在 DOM树 构建完成后将会去遍历首屏内的所有图片标签，并且监听所有图片标签 onload 事件，最终遍历图片标签的加载时间的最大值，并用这个最大值减去 navigationStart 即可获得近似的首屏时间。

此时首屏时间等于 加载最慢的图片的时间点 - performance.timing.navigationStart;
//首屏时间尝试：
//1,获取首屏基线高度
//2,计算出基线dom元素之上的所有图片元素
//3,所有图片onload之后为首屏显示时间
//

```
function getOffsetTop(ele) {
    var offsetTop = ele.offsetTop;
    if (ele.offsetParent !== null) {
        offsetTop += getOffsetTop(ele.offsetParent);
    }
    return offsetTop;
}

var firstScreenHeight = win.screen.height;
var firstScreenImgs = [];
var isFindLastImg = false;
var allImgLoaded = false;
var t = setInterval(function() {
    var i, img;
    if (isFindLastImg) {
        if (firstScreenImgs.length) {
            for (i = 0; i < firstScreenImgs.length; i++) {
                img = firstScreenImgs[i];
                if (!img.complete) {
                    allImgLoaded = false;
                    break;
                } else {
                    allImgLoaded = true;
                }
            }
        } else {
            allImgLoaded = true;
        }
        if (allImgLoaded) {
            collect.add({
                firstScreenLoaded: startTime - Date.now()
            });
            clearInterval(t);
        }
    } else {
        var imgs = body.querySelector('img');
        for (i = 0; i<imgs.length; i++) {
            img = imgs[i];
            var imgOffsetTop = getOffsetTop(img);
            if (imgOffsetTop > firstScreenHeight) {
                isFindLastImg = true;
                break;
            } else if (imgOffsetTop <= firstScreenHeight && !img.hasPushed) {
                img.hasPushed = 1;
                firstScreenImgs.push(img);
            }
        }
    }
}, 0);
doc.addEventListener('DOMContentLoaded', function() {
    var imgs = body.querySelector('img');
    if (!imgs.length) {
        isFindLastImg = true;
    }
});

win.addEventListener('load', function() {
    allImgLoaded = true;
    isFindLastImg = true;
    if (t) {
        clearInterval(t);
    }
    collect.log(collect.global);
});

```
解释一下思路，大概就是判断首屏有没有图片，如果没图片就用domready时间，如果有图，分2种情况，图在首屏，图不在首屏，如果在则收集，并判断加载状态，加载完毕之后则首屏完成加载，如果首屏没图，找到首屏下面的图，立刻触发首屏完毕。可以想象这么做前端收集是不准的，但是可以确保最晚不会超过win load，所以应该还算有些意义。。没办法，移动端很多浏览器不支持performance api，所以土办法前端收集，想出这么个黑魔法，在基线插入节点收集也是个办法，但是不友好，而且现在手机屏幕这么多。。
                              
**3、自定义模块内容计算法**
  
由于统计首屏内图片完成加载的时间比较复杂。因此我们在业务中通常会通过自定义模块内容，来简化计算首屏时间。如下面的做法：

- 忽略图片等资源加载情况，只考虑页面主要 DOM
- 只考虑首屏的主要模块，而不是严格意义首屏线以上的所有内容

**实际上用performance.timing来计算首屏加载时间与白屏时间非常简单与精确。不过目前只支持IE10和chrome**
贴下其API的使用

```js
                                                   var navigationStart = performance.timing.navigationStart;
//1488984540668
console.log(navigationStart);

//Wed Mar 08 2017 22:49:44 GMT+0800 (中国标准时间)
console.log(new Date(new Date(navigationStart)));
复制代码
　　redirectStart:到当前页面的重定向开始的时间。但只有在重定向的页面来自同一个域时这个属性才会有值；否则，值为0
　　redirectEnd:到当前页面的重定向结束的时间。但只有在重定向的页面来自同一个域时这个属性才会有值；否则，值为0

console.log(performance.timing.redirectStart);//0
console.log(performance.timing.redirectEnd);//0
　　fetchStart:开始通过HTTP GET取得页面的时间

console.log(performance.timing.fetchStart);//1488984540668
　　domainLookupStart:开始査询当前页面DNS的时间，如果使用了本地缓存或持久连接，则与fetchStart值相等
　　domainLookupEnd:査询当前页面DNS结束的时间，如果使用了本地缓存或持久连接，则与fetchStart值相等

console.log(performance.timing.domainLookupStart);//1488984540670
console.log(performance.timing.domainLookupEnd);//1488984540671
　　connectStart:浏览器尝试连接服务器的时间
　　secureConnectionStart:浏览器尝试以SSL方式连接服务器的时间。不使用SSL方式连接时，这个属性的值为0 
　　connectEnd:浏览器成功连接到服务器的时间

console.log(performance.timing.connectStart);//1488984540671
console.log(performance.timing.secureConnectionStart);//0
console.log(performance.timing.connectEnd);//1488984540719
　　requestStart:浏览器开始请求页面的时间
　　responseStart:浏览器接收到页面第一字节的时间
　　responseEnd:浏览器接收到页面所有内容的时间

console.log(performance.timing.requestStart);//1488984540720
console.log(performance.timing.responseStart);//1488984540901
console.log(performance.timing.responseEnd);//1488984540902
　　unloadEventStart:前一个页面的unload事件开始的时间。但只有在前一个页面与当前页面来自同一个域时这个属性才会有值；否则，值为0
　　unloadEventEnd:前一个页面的unload事件结束的时间。但只有在前一个页面与当前页面来自同一个域时这个属性才会有值；否则，值为0

console.log(performance.timing.unloadEventStart);//1488984540902
console.log(performance.timing.unloadEventEnd);//1488984540903
　　domLoading:document.readyState变为"loading"的时间，即开始解析DOM树的时间
　　domInteractive:document.readyState变为"interactive"的时间，即完成完成解析DOM树的时间
　　domContentLoadedEventStart:发生DOMContentloaded事件的时间，即开始加载网页内资源的时间
　　domContentLoadedEventEnd:DOMContentLoaded事件已经发生且执行完所有事件处理程序的时间，网页内资源加载完成的时间
　　domComplete:document.readyState变为"complete"的时间，即DOM树解析完成、网页内资源准备就绪的时间

console.log(performance.timing.domLoading);//1488984540905
console.log(performance.timing.domInteractive);//1488984540932
console.log(performance.timing.domContentLoadedEventStart);//1488984540932
console.log(performance.timing.domContentLoadedEventEnd);//1488984540932
console.log(performance.timing.domComplete);//1488984540932
　　loadEventStart:发生load事件的时间，也就是load回调函数开始执行的时间 
　　loadEventEnd:load事件已经发生且执行完所有事件处理程序的时间

console.log(performance.timing.loadEventStart);//1488984540933
console.log(performance.timing.loadEventEnd);//1488984540933
                                                       

```
## 第九问：你知道web Worker吗？
  
  >多线程技术在服务端技术中已经发展的很成熟了，而在Web端的应用中却一直是鸡肋
在新的标准中，提供的新的WebWork API，让前端的异步工作变得异常简单。
使用：创建一个Worker对象，指向一个js文件，然后通过Worker对象往js文件发送消息，js文件内部的处理逻辑，处理完毕后，再发送消息回到当前页面，纯异步方式，不影响当前主页面渲染。

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <script type="text/javascript">
        //创建线程 work对象
        var work = new Worker("work.js");      //work文件中不要存在跟ui代码
        //发送消息
        work.postMessage("100");
        // 监听消息
        work.onmessage = function(event) {
            alert(event.data);
        };
    </script>
</head>
<body>

</body>
</html>          
```
work.js
```js
  onmessage = function (event) {
    //从1加到num
    var num = event.data;
    var result = 0;
    for (var i = 1; i <= num; i++) {
        result += i;
    }
    postMessage(result);
}
   
```
                     


# 七、关于【promise】十问

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS84NThlYTAzYi01MTlhLTQ0NGYtYThlMC00NTM4NDU4YjhiMjYucG5n?x-oss-process=image/format,png)


## 第一问：了解 Promise 吗？
1) 了解Promise，Promise是一种异步编程的解决方案，有三种状态，pending（进行中）、resolved（已完成）、rejected（已失败）。当Promise的状态由pending转变为resolved或reject时，会执行相应的方法

2) Promised的特点是只有异步操作的结果，可以决定当前是哪一种状态，任务其他操作都无法改变这个状态，也是“Promise”的名称的由来，同时，状态一旦改变，就无法再次改变状态



## 第二问：Promise 解决的痛点是什么？
Promise解决的痛点：

1）回调地狱，代码难以维护， 常常第一个的函数的输出是第二个函数的输入这种现象，是为解决异步操作函数里的嵌套回调（callback hell）问题，代码臃肿，可读性差，只能在回调里处理异常

2）promise可以支持多个并发的请求，获取并发请求中的数据

3）promise可以解决可读性的问题，异步的嵌套带来的可读性的问题，它是由异步的运行机制引起的，这样的代码读起来会非常吃力

4）promise可以解决信任问题，对于回调过早、回调过晚或没有调用和回调次数太少或太多，由于promise只能决议一次，决议值只能有一个，决议之后无法改变，任何then中的回调也只会被调用一次，所以这就保证了Promise可以解决信任问题
5)Promise最大的好处是在异步执行的流程中，把执行代码和处理结果的代码清晰地分离了
## 第三问：Promise 解决的痛点还有其他方法可以解决吗？如果有，请列举。

1）Promise 解决的痛点还有其他方法可以解决，比如setTimeout、事件监听、回调函数、Generator函数，async/await

2）setTimeout：缺点不精确，只是确保在一定时间后加入到任务队列，并不保证立马执行。只有执行引擎栈中的代码执行完毕，主线程才会去读取任务队列

3）事件监听：任务的执行不取决于代码的顺序，而取决于某个事件是否发生

4）Generator函数虽然将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。即如何实现自动化的流程管理

5）async/await

## 第四问：Promise 如何使用？
1）创造一个Promise实例

2）Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数

3）可用Promise的try和catch方法预防异常

## 第五问：Promise 的业界实现都有哪些？
1） promise可以支持多个并发的请求，获取并发请求中的数据

2）promise可以解决可读性的问题，异步的嵌套带来的可读性的问题，它是由异步的运行机制引起的，这样的代码读起来会非常吃力

## 第六问： Promise的问题？解决办法？
promise的问题为：

promise一旦执行，无法中途取消

promise的错误无法在外部被捕捉到，只能在内部进行预判处理

promise的内如何执行，监测起来很难

解决办法

正是因为这些原因，ES7引入了更加灵活多变的async，await来处理异步

## 第七问：老旧浏览器没有Promise全局对象增么办?

果辛辛苦苦写完代码，测试后发现不兼容IE6、7增么办？难道要推翻用回调函数重写？当然不是这样，轮子早就造好了。

我们可以使用es6-promise-polyfill。es6-promise-polyfill可以使用页面标签直接引入，可以通过es6的import方法引入（如果你是用webpack），在node中可以使用require引入，也可以在Seajs中作为依赖引入。

引入这个polyfill之后，它会在window对象中加入Promise对象。这样我们就可以全局使用Promise了。


## 第八问：怎么让一个函数无论promise对象成功和失败都能被调用？

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


## 第九问：红灯3秒亮一次，绿灯1秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？（用Promise实现）三个亮灯函数已经存在：

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

## 第十问:实现 mergePromise 函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组 data 中。


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

## 第十一问：封装一个异步加载图片的方法


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

## 第十二问：手写promise

请看我的另一篇文章
[一步一步实现自己的Promise](https://mp.weixin.qq.com/s?__biz=MzU5NDM5MDg1Mw==&tempkey=MTA1OV9Bb2RScjkyZ2NEb21iR0tvWU9WNGhzYUJLbmk2SlJwYUJIM0ZPM3pQbXJvRUVJUWgzYlpZMmNHT3ZPWURhelk4ck1zVkhFYWVTYUhyd01EaTVrd3hPNVFVRGlFSVk5ajBSdmE2cUo1bzgwQ2xiTHJxLVR5amZpdkh3NjFuRlRtMGx1NlhUZm5zUnUzQ3JIU09zaUJzMmdSVC0wNUwwd0twWG5ITGZBfn4%3D&chksm=7e00b9d2497730c424258da7d8dac063c0a3f1792a77dc241e7f72a682936ef5799e7f625747#rd)

# 八、关于【事件】十问

## 第一问：请介绍下事件模型

目前共有三种事件模型，它们分别是：

DOM0 级事件模型、IE 事件模型、DOM2 级事件模型

**DOM0 级事件模型** 又称原始事件模型，有两种方式，最直观的提下如下代码：


```js
// 方式一
// 将事件直接通过属性绑定在元素上
<button onclick="clickBtn()"></button>
// 方式二
// 获取到页面元素后，通过 onclick 等事件，将触发的方法指定为元素的事件
// 取消该事件可直接设置为 null
var btn = document.getElementById('btn')
btn.onclick = function () {...}
btn.onclick = null


```

DOM0 级的事件模型，方法较为简单，但是将逻辑和界面耦合在了一起，对之后的维护不是很友好

但也不是没有优点，这种方式兼容所有浏览器

**IE 事件模型**

IE 事件模型一共有两个阶段：

- 事件处理阶段：事件在达到目标元素时，触发监听事件
- 事件冒泡阶段：事件从目标元素冒泡到 document，并且一次检查各个节点是否绑定了监听函数，如果有则执行

绑定和移除事件的 api 分别如下：


```js
// 绑定事件
el.attachEvent(eventType, handler)

// 移除事件
el.detachEvent(eventType, handler)
```
**参数说明：**

eventType 是如onclick一样的带有”on“的事件，绑定事件时，handler可以是具名函数，也可以是匿名函数，但是匿名函数无法移除

我们会发现，IE 事件模型与我们平时用的事件绑定方法addEventListener，也就是下面要说的 DOM2 级事件模型有点相似，但是 IE 事件模型仅在 IE 浏览器中有效，不兼容其他浏览器

**DOM2 级事件模型**

W3C标准模型，也是我们频繁使用的事件模型，除 IE6-8 以外的所有现代浏览器都支持该事件模型
DOM2 级事件模型共有三个阶段：


1. 事件捕获阶段：事件从 document 向下传播到目标元素，依次检查所有节点是否绑定了监听事件，如果有则执行
2. 事件处理阶段：事件在达到目标元素时，触发监听事件
3. 事件冒泡阶段：事件从目标元素冒泡到 document，并且一次检查各个节点是否绑定了监听函数，如果有则执行

## 第二问：介绍下这三种事件模型的区别

- Dom0 模型：

1. this指向： 指向函数中的this指向的是被绑定的元素
2. 绑定多个同事件类型的事件时，如对同个元素绑定多个click，则后面的会覆盖前面的，最后只有一个会执行
- IE 模型：

1. this指向： 指向函数中的this指向的是**window**
2. 绑定多个同事件类型的事件时，如对同个元素绑定多个click，则后面的不会覆盖前面的，执行顺序是先执行下面的，从下往上执行
3. 只有两个参数：第一个参数为 事件类型，第二个为事件执行函数目标阶段，
4. 只有事件冒泡阶段
5. 获取目标元素： window.event.srcElement
- Dom2 模型：

1. this指向： 指向函数中的this指向的是被绑定的元素
2. 绑定多个同事件类型的事件时，如对同个元素绑定多个click，则后面的不会覆盖前面的，执行顺序是先执行上面的，从上往下执行
3. 有三个参数：第一个参数为 事件类型，第二个为事件执行函数，第三个为布尔值，表示是否用事件捕获
4. 有事件捕获阶段，处于目标阶段，事件冒泡阶段
5. 获取目标元素： event.target

欢迎补充。。。

## 第三问：请介绍下事件流？

事件流所描述的就是从页面中接受事件的顺序，事件流分为两种：事件冒泡（主流）和事件捕获. 版本IE（IE8及以下版本）不支持捕获阶段

**1、事件冒泡**


![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS82OWQ1YzljNi0xMzM1LTQ5ZTgtODViNy04MTA4ZGJjZDVjYTkucG5n?x-oss-process=image/format,png)
事件开始时由具体元素接收，然后逐级向上传播到父元素

**2、事件捕获**

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS83ZWVlZTQxMi1iY2VlLTQxNTgtYmJkZi1lZWM2MDEwMGJjYjQucG5n?x-oss-process=image/format,png)

父元素的节点更早接收事件，而具体元素最后接收事件，与事件冒泡相反

## 第四问 怎么阻止事件冒泡和事件捕获以及默认事件？
1. 阻止事件冒泡 ：使用`e.stopPropagation();` IE使用` window.event.cancelBubble = true;`

```js
function stopBubble(e){
     <!--如果提供了事件对象，则这是个非IE浏览器-->
    if(e&&e.stopPropagation){
        e.stopPropagation();
    }else{
        <!--我们需要使用IE的方式来取消事件冒泡-->
        window.event.cancelBubble = true;
    }
} 
```
2. 阻止事件捕获：与冒泡一样 使用`e.stopPropagation()，IE没有捕获阶段，所以不用
3. 阻止默认事件：

```js
function stopDefault(e){
    <!--阻止默认行为W3C-->
    if(e&&e.preventDefault()){
        e.preventDefault();
    }else{
        <!--IE中阻止默认行为-->
        windown.event.returnValue = false
    }
}
```


## 第六问：事件的委托（代理 Delegated Events）的原理以及优缺点

委托（代理）事件是那些被绑定到父级元素的事件，但是只有当满足一定匹配条件时才会触发。这是靠事件的冒泡机制来实现的，

1. 优点是：
- （1）可以大量节省内存占用，减少事件注册，比如在table上代理所有td的click事件就非常棒
- （2）可以实现当新增子对象时无需再次对其绑定事件，对于动态内容部分尤为合适
2. 缺点是：
- 事件代理的应用常用应该仅限于上述需求下，如果把所有事件都用代理就可能会出现事件误判，即本不应用触发事件的被绑上了事件。

**例子：**

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8wN2QzOGZjMi0zNTAzLTRjMjMtOTVjOS00OGY2YmRlYzIyZWIucG5n?x-oss-process=image/format,png)

>要求：兼容浏览器 考点：事件对象e，IE下事件对应的属性名。 重点是要说到target,currentTarget以及IE下的srcElement和this。

## 第七问：编写一个自定义事件类，包含on/off/emit/once方法


![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8zZGE1MzFjYi1hZGI2LTQyZmYtOTkyYy0xNTNmNDk4YTlkZjAucG5n?x-oss-process=image/format,png)
可能谈到Evnet，customerEvent，document.createEvent

## 第八问：怎样判断js脚本是否加载完，并在加载完后进行操作

在工作过程中，经常会遇到按需加载的需求，即在脚本加载完成后，返回一个回调函数，在回调函数中进行相关操作，那如何去判断脚本是否加载完成了呢？

可以对加载的js对象使用onload来判断，jsDom.onload

>ie6、7不支持js.onload方法，使用js.onreadystatechange来解决
js.onreadystatechange来跟踪每个状态的变化（loading、loaded、interactive、complete），当返回状态为loaded或者complete时，表示加载完成，返回回调函数.


![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9kMzI5MTA4Ny04YWU5LTRiZDItYTE1YS0xYmY0MDFiOWIyZGYucG5n?x-oss-process=image/format,png)

## 第九问：上面的代码中，script脚本是什么时候开始加载的？

在` body.appendChild(jsNode)`;这一步，即添加到文档上后开始加载，这跟image不同，image是 `image.src = url`后开始加载

## 第十问 如何判断页面是否加载完成？

- 方式一：window.onload：

当一个文档完全下载到浏览器中时，才会触发window.onload事件。这意味着页面上的全部元素对js而言都是可以操作的，也就是说页面上的所有元素加载完毕才会执行。这种情况对编写功能性代码非常有利，因为无需考虑加载的次序。

```js
 window.onload=function(){
        dosth//你要做的事情
}
```

- 方式二：$(document).ready()：


会在DOM完全就绪并可以使用时调用。虽然这也意味着所有元素对脚本而言都是可以访问的，但是，并不意味着所有关联的文件都已经下载完毕。换句话说，当HMTL下载完成并解析为DOM树之后，代码就会执行。


```js

$(document).ready(function(){
  dosth//你要做的事情
})

```

注意：页面加载完成有两种事件，一是ready，表示文档结构已经加载完成（不包含图片等非文字媒体文件），二是onload，指示页 面包含图片等文件在内的所有元素都加载完成。(可以说：ready 在onload 前加载！！！)

- 方式三：

用document.onreadystatechange的方法来监听状态改变， 然后用document.readyState == “complete”判断是否加载完成,需要的朋友可以参考下，用document.onreadystatechange的方法来监听状态改变， 然后用

```
document.readyState == “complete”判断是否加载完成

document.onreadystatechange = function()//当页面加载状态改变的时候执行function
```



```js
 { 
     if(document.readyState == "complete")
      {   //当页面加载状态为完全结束时进入
        init();   //你要做的操作。
      }
  }
复制代
```

## 第十一问 cookie和session的区别：

- ①存在的位置：
cookie 存在于客户端，临时文件夹中；  session存在于服务器的内存中，一个session域对象为一个用户浏览器服务

- ②安全性
cookie是以明文的方式存放在客户端的，安全性低，可以通过一个加密算法进行加密后存放；  session存放于服务器的内存中，所以安全性好

- ③网络传输量
cookie会传递消息给服务器；  session本身存放于服务器，不会有传送流量

- ④生命周期(以20分钟为例)
cookie的生命周期是累计的，从创建时，就开始计时，20分钟后，cookie生命周期结束；
session的生命周期是间隔的，从创建时，开始计时如在20分钟，没有访问session，那么session生命周期被销毁。但是，如果在20分钟内（如在第19分钟时）访问过session，那么，将重新计算session的生命周期。关机会造成session生命周期的结束，但是对cookie没有影响

- ⑤访问范围
cookie为多个用户浏览器共享；  session为一个用户浏览器独享









