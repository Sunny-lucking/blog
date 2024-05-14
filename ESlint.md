[toc]
## 概括
### 1、Vetur插件
Vetur是一款Vue代码高亮显示的一款插件，在没有使用此插件前，以 .vue的文件名代码是没有颜色的！！！

### 2、 npm- ESLint 
编译时，检查。
运行 npm run eslint 才能看到错误，此时可能已经一堆错误了。

### 3、Vscode - ESLint插件
红线就是它的提示。解决上面提到的问题

该编辑器插件会读取当前项目中的 `.eslintrc.js` 的配置，并在编辑器中把不符合规则的错误给提示出来。

### 4、VScode - Prettier插件
该插件主要用于格式化代码

### 5、.vscode文件夹

vscode 打开的文件夹的根目录是一个工作区，.vscode目录就是存放当前工作区相关配置文件的目录，这样分享项目时，也把该项目的 vscode 配置分享出去了，保证了协同工作开发环境的统一性。

## 项目实践
### 1、初始化项目
```js
// 新建demo工程目录，初始化 npm 项目
npm init -y
 
// 安装 eslint    推荐安装为项目的开发依赖
npm i -D eslint@8.6.0
 
// 初始化 eslint 配置文件
npx eslint --init
```

![](https://files.mdnice.com/user/3934/6fd3d8e0-7200-4d09-9187-74ef75c6bb3b.png)

生成.eslintrc.js文件

```js
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    extends: ['eslint:recommended'],
    "parserOptions": {
        "ecmaVersion": 15,
        "sourceType": "module"
    },
    "rules": {
    },
};
```

创建一个js文件:
src/index.j


```js
var q = 1;

console.log(cc)
```

package.json配置指令


```js
"scripts": {
    "eslint": "eslint src/**"
},
```
执行npm run eslint

![](https://files.mdnice.com/user/3934/4fba9091-5550-442d-a62e-0d01d8fd0a54.png)




可以看到控制台提示了，但是代码并没有红线提示。

### 2、安装vscode eslint插件

需要红线提示需要安装vscode eslint 插件


![](https://files.mdnice.com/user/3934/00bb78de-592a-4861-95a8-7860af79ed42.png)

安装完可以看到标红了


![](https://files.mdnice.com/user/3934/d9b1d266-109d-4d26-9c4c-336bbe26419c.png)

现在是只实现了提示，但是不会自动修复

自动修复需要再加指令

```js
  "scripts": {
    "eslint": "eslint src/**",
    "eslintfix": "eslint src/** --fix"
  },
```


![](https://files.mdnice.com/user/3934/87653303-e611-4ced-8696-9e1cb2abbedd.png)





执行npm run eslintfix

![](https://files.mdnice.com/user/3934/cc3767d4-c749-4785-8b15-fbcc5e7e386b.png)

可以看到自动修复了。

由于eslint只是针对js的，对于vue现在是无效的

### 3、安装 eslint-plugin-vue 插件



![](https://files.mdnice.com/user/3934/7290492c-761e-40a0-af13-d4f95007bb5f.png)
此时就需要安装 eslint-plugin-vue 插件。`npm i -D eslint-plugin-vue`

安装后在 .eslintrc.js 中配置插件


```js
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    extends: ['eslint:recommended','plugin:vue/recommended'],
    "parserOptions": {
        "ecmaVersion": 15,
        "sourceType": "module"
    },
    "rules": {
        semi: 2, // 句末是否加分号
    },
    plugins:["vue"]
};

```
可以看到已经能检测到vue文件

![](https://files.mdnice.com/user/3934/39ebad2d-c2d9-4bea-83a0-057c0009a708.png)

实际中我们不可能每次都手动执行npm run eslintfix，而是保存的时候，自动修复

需要在setting.json中添加

```js
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
},
```
可以看到ctrl + s 的时候就自动修复了，但是没有格式化。

![](https://files.mdnice.com/user/3934/92f0eb1e-ea93-42ac-bf5c-c5d996ff6fbb.png)

### 4、安装prettier
这时候就要安装prettier了

![](https://files.mdnice.com/user/3934/cb681ac4-610f-4c34-9927-51005c277dbe.png)

![](https://files.mdnice.com/user/3934/72e30d77-7534-46c2-b0ed-0540f3a25175.png)
可以看到自动格式化

其实安装了prettier之后安装了之后，自动格式化修复也是prettier的功能，可以把eslint禁用掉，发现也会自动修复。

因为prettier也有自己的rules来实现修复。

创建.prettier.js



```js
module.exports = {
  semi: false,
};

```

这个时候保存，会发现会自动添加上分号，然后分号又消失，这是因为eslint的rules和prettier的rules起冲突了。

### 5、 解决冲突
解决冲突的方法是用 eslint-plugin-prettier,把Prettier配置成ESLint的一个插件，让其当做一个linter规则来运行，可参考其官网。
这样配置后，ESLint进行格式化时就会忽略跟Prettier重叠的格式规则，这些交由Prettier来进行格式化，这样二者可以愉快地一起分工协作了。

```js
npm i eslint @vue/eslint-config-prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue prettier -D
```

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["@vue/prettier", "eslint:recommended", "plugin:vue/recommended"],
  parserOptions: {
    ecmaVersion: 15,
    sourceType: "module",
  },
  rules: {
    semi: 2, // 句末是否加分号
    "no-console": 2,
    eqeqeq: 2,
  },
  plugins: ["vue"],
}

```

然而目前为止，我们都是在自己的本地配置的这些保存自动格式化和修复的功能。我们希望在别人拉下我们的代码后，也会自动实现这些功能。这就要用到.vscode文件夹了。

### 6、使用.vscode实现共享配置

.vscode目录下一般有 4 种配置文件和项目中的代码片段
- extensions.json：推荐当前项目使用的插件
- setting.json：vscode编辑器和插件的相关配置
- launch.json：调试配置文件
- task.json：任务配置
- xxxxxxx.code-snippets：项目中共享的代码片段


#### 1.setting.json：vscode编辑器和插件的相关配置
优先使用这里的配置
![](https://files.mdnice.com/user/3934/551e5e89-0e60-4e21-b570-362353d5a2d5.png)
#### 2.extensions.json：推荐当前项目使用的插件、

![](https://files.mdnice.com/user/3934/2fca142e-f93a-4a59-8494-85e71a9864bc.png)


![](https://files.mdnice.com/user/3934/6c3e2eee-047c-480d-9fea-3de4a9550997.png)
其他人拉到代码后就会将会推荐安装这些插件

![](https://files.mdnice.com/user/3934/83328fee-2e9a-440e-9717-7e95bb25c4d5.png)












