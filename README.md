## 简介

以下内容基于Webpack和Rollup这两个打包工具来展开。  

工具的使用是分场景的，Rollup的使用场景是，你的代码基于 ES6 模块编写，并且你做的东西是准备给他人使用的。  

有一句经验之谈：**在开发应用时使用 Webpack，开发库时使用 Rollup。**

例如：React、Vue、Ember、Preact、D3、Three.js、Moment 等众多知名项目都使用了 Rollup

> 优点 

* 编译运行出来的代码内容格式可读性好。

* 几乎没什么多余代码，除了必要的cjs, umd头外，bundle代码基本和源码没什么差异，没有奇怪的`__webpack_require__`, `Object.defineProperty`

* 相比Webpack，Rollup拥有无可比拟的性能优势，这是由依赖处理方式决定的，编译时依赖处理（Rollup）自然比运行时依赖处理（Webpack）性能更好,而且没什么多余代码，如上文提到的，webpack bundle不仅体积大，非业务代码（`__webpack_require__`, `Object.defineProperty`）执行耗时也不容小视  
Rollup没有生成这些额外的东西，执行耗时主要在于`Compile Script` 和 `Evaluate Script` 上，其余部分可以忽略不计  

* 支持ES6模块和IIFE格式。

* 对于**ES6模块**依赖库，Rollup会静态分析代码中的 import，并将排除任何未实际使用的代码。(Tree-shaking)

> 缺点

* 插件生态相对较弱，一些常见需求无法满足  
比如打包多个依赖库，把公共依赖项提出来（Webpack的CommonsChunkPlugin）还有HMR(模块热替换)

* 文档相对较少，遇到问题无法快速解决

### 安装

`npm install -g rollup`

### 全部指令

```
Usage: rollup [options] <entry file>

Basic options:

-v, --version               Show version number
-h, --help                  Show this help message
-c, --config                Use this config file (if argument is used but value
                              is unspecified, defaults to rollup.config.js)
-w, --watch                 Watch files in bundle and rebuild on changes
-i, --input                 Input (alternative to <entry file>)
-o, --output.file <output>  Output (if absent, prints to stdout)
-f, --output.format [es]    Type of output (amd, cjs, es, iife, umd)
-e, --external              Comma-separate list of module IDs to exclude
-g, --globals               Comma-separate list of `module ID:Global` pairs
                              Any module IDs defined here are added to external
-n, --name                  Name for UMD export
-m, --sourcemap             Generate sourcemap (`-m inline` for inline map)
-l, --legacy                Support IE8
--amd.id                    ID for AMD module (default is anonymous)
--amd.define                Function to use in place of `define`
--no-strict                 Don't emit a `"use strict";` in the generated modules.
--no-indent                 Don't indent result
--environment <values>      Settings passed to config file (see example)
--no-conflict               Generate a noConflict method for UMD globals
--no-treeshake              Disable tree-shaking
--silent                    Don't print warnings
--intro                     Content to insert at top of bundle (inside wrapper)
--outro                     Content to insert at end of bundle (inside wrapper)
--banner                    Content to insert at top of bundle (outside wrapper)
--footer                    Content to insert at end of bundle (outside wrapper)
--interop                   Include interop block (true by default)
```

### 配置文件细则  

```
export default {
  // 核心选项
  input,     // 必须
  external,
  plugins,

  // 额外选项
  onwarn,

  // danger zone
  acorn,
  context,
  moduleContext,
  legacy

  output: {  // 必须 (如果要输出多个，可以是一个数组)
    // 核心选项
    file,    // 必须
    format,  // 必须
    name,
    globals,

    // 额外选项
    paths,
    banner,
    footer,
    intro,
    outro,
    sourcemap,
    sourcemapFile,
    interop,

    // 高危选项
    exports,
    amd,
    indent
    strict
  },
};
```

### 简单实例

> 生成浏览器可用

```
//打包main.js到bundle.js 打包格式是立即执行函数
rollup main.js --o bundle.js --f iife
```

> 生成Node.js可用

```
//打包main.js到bundle.js 打包格式是commonjs。
rollup main.js --o bundle.js --f cjs
```

> Node.js和浏览器都可用

```
//打包main.js到bundle.js 打包格式是UMD,这个格式需要一个模块名
rollup main.js --o bundle.js -f umd --name "myBundle"
```

> 运行配置文件

`rollup -c`


## 实际操作  

### example1 
```
// src/example1/main.js
import one from './module1.js';
export default function () {
    console.log(one);
}

// src/example1/module1.js
export default 'hello world!'
```

在**项目根目录**(之后Rollup运行会默认这个目录)运行  
`rollup src/example1/main.js -o dist/example1/bundle.js -f cjs`  

*解析：*   
`-f` 选项（ `--output.format` 的缩写）指定了所创建 bundle 的类型，打包时必须要有的选项，否则会报错。  
输出的格式有amd, cjs, es, iife, umd,可以把命令行中 `-f` 后面的 `cjs` 改为其他的，看一下生成的bundle.js的内容有什么不一样。对于模块不熟悉的可以看一下 [很全很全的JavaScript的模块讲解](https://segmentfault.com/a/1190000012464333?_ea=3022967)  

`-o` 是 `--output.file` 的缩写，如果不写会默认输出到命令行终端（标准输出）。

### example2

如果添加更多的选项，上面这种命令行的方式就显得麻烦了，就得需要 **使用配置文件** 了。  

在项目 `src/example2` 文件夹下，新建一个 `rollup.config.js` 文件，写入以下代码：  
```
export default {
    input: 'src/example2/main.js',
    output: {
        file: 'dist/example2/bundle.js',
        format: 'cjs'
    }
}
```

新建一个`main.js` 和 `module2.js`如下：  
```
// src/example2/main.js
import one from './module2.js';
export default function () {
    console.log(one);
}

// src/example1/module2.js
export default 'hello config!'
```

接下来就是运行命令，`rollup.config.js`本来是Rollup默认运行的配置文件，如果我们的`rollup.config.js`是放在根目录下的，可以直接运行`rollup -c`，不用任何选项，但是我们是放在`src/module2`文件夹下的，所以要加上配置文件的路径  
`rollup -c src/module2/rollup.config.js`  

**注意**  
1. 同样的命令行选项将会覆盖配置文件中的选项，例如:  
`rollup -c src/module2/rollup.config.js -o dist/example2/bundle2.js` 那么打包好的文件名就是`bundle2.js`  
2. Rollup 本身会处理配置文件，所以可以使用 `export default` 语法——代码不会经过 `Babel` 等类似工具编译，所以只能使用所用 Node.js 版本支持的 ES2015(ES6) 语法。  

### example3 

随着构建更复杂的 bundle，我们需要加入插件(plugins)。  

使用 [rollup-plugin-json](https://github.com/rollup/rollup-plugin-json)，令 Rollup 从 JSON 文件中读取数据。  
将 rollup-plugin-json 安装为开发依赖，因为代码实际执行时不依赖这个插件——只是在打包时使用，所以用的是`--save-dev` 而不是 `--save`  

`npm i -D rollup-plugin-json` 或者 `npm install --save-dev rollup-plugin-json`  

`src/example3`文件夹下新建 `main.js` 和 `rollup.config.js`  
```
// main.js
import { version} from '../../package.json';

export default function () {
    console.log(`version is ${version}`);
}

// rollup.config.js
import json from 'rollup-plugin-json';

export default {
    input: 'src/example3/main.js',
    output: {
        file: 'dist/example3/bundle.js',
        format: 'cjs'
    },
    plugins: [
        json()
    ]
}
```
运行命令 `rollup -c src/example3/rollup.config.js`  

*扩展：* json函数可以传入 `include`指定包含文件、`exclude`指定排除文件，`preferConst`如果为`true`,用const接受输出，如果为`false`，用 `var`接收输出。  

**注意：** tree-shaking的作用，可以看到打包好bundle.js中只有version输入，package.json 中的其它数据被忽略了。  

### example4

Rollup 不知道怎么处理依赖于从 npm 安装到你的 `node_modules` 文件夹中的软件包。  

例如，添加一个简单的依赖 [the-answer](https://www.npmjs.com/package/the-answer)，它输出对生活、宇宙及其它一切的答案，这个简单的包是用来演示如何将npm包汇总到Rollup包中。特别是, 此包在`package.json`中添加了 "main" (UMD 格式) 和 "模块" (ES2015 格式)这个两个选项。

看一下，按照普通流程引入 `the-answer` 模块会是什么结果。  
`npm install the-answer`  
在 `src/example4` 文件夹下新增 `main.js` 和 `rollup.config.js`  
```
// main.js
import answer from 'the-answer';

export default function () {
    console.log('the answer is ' + answer);
}


// rollup.config.js
export default {
    input: 'src/example4/main.js',
    output: {
        file: 'dist/example4/bundle.js',
        format: 'cjs'
    },
    plugins: [
        // 没有加入任何插件
    ]
}
```
运行： `rollup -c src/example4/rollup.config.js` 会有一个警告 `Unresolved dependencies` ,我们看一下 打包好的`dist/example4/bundle.js`  
```
// 截取dist/example4/bundle.js`
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var answer = _interopDefault(require('the-answer'));

// 可以看到the-answer并没有打包进来，还得用node的require去请求，然后经过函数转化才能拿到the-answer的输出值
// 我们可以看一下 node_modules 下的 the-answer 模块暴露出的内容

var index = 42;
export default index;

// 这样也可以看出，如果the-answer如果打包进来，应该是：
var answer = 42;
```
**现在我们需要一个插件 [rollup-plugin-node-resolve ](https://github.com/rollup/rollup-plugin-node-resolve) 来告诉 Rollup 如何查找外部模块**  

`npm i -D rollup-plugin-node-resolve`  

将插件加入配置文件中  
```
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/example4/main.js',
    output: {
        file: 'dist/example4/bundle.js',
        format: 'cjs'
    },
    plugins: [
        resolve()
    ]
}
```
再次运行`rollup -c src/example4/rollup.config.js` 没有警告 ,我们看一下打包好的`dist/example4/bundle.js`  
```
'use strict';

// the-answer的输出已经打包进来了
var index = 42;

function main () {
    console.log('the answer is ' + index);
}

module.exports = main;
```

### example5

类似 `the-answer` 一些库因为 `package.json`里的module选项可以让我们正常导入的ES6模块。 但是目前，npm中的大多数包都是以CommonJS模块的形式出现的。 在它们更改之前，我们需要将CommonJS模块转换为 ES2015 供 Rollup 处理。  

 [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs) 插件就是用来将 CommonJS 转换成 ES2015 模块的。通常，这个插件会跟 `rollup-plugin-node-resolve`配合使用，这样就能打包 `node_modules`依赖中的CommonJS。  
 `rollup-plugin-commonjs` 应该用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏CommonJS的检测。  

 安装：`npm i -D rollup-plugin-commonjs`  

 在 `src/example5`文件夹下新建 `main.js` 和 `module5.js` `rollup.config.js`， 用来验证插件。  
 ```
// module5.js
exports.named = 'cfangxu';
//module.exports = {named: 'cfangxu'} 这个会报错，但是插件文档里说是好的，给他提一个issues

// main.js
import { named } from './module5.js';
export default function () {
    console.log(named);
}

// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/example5/main.js',
    output: {
        file: 'dist/example5/bundle.js',
        format: 'cjs'
    },
    plugins: [
        resolve({
            jsnext: true,
            main: true
        }),
        commonjs()
    ]
}
```

**注意：** 如果引入的是 `node_modules`里的模块  
例如：`import { named } from 'my-lib';`  
要启用 `namedExports` 选项显示的指定命名输出。当然你也可以整体都引入  
即： `import all from 'my-lib';`  

### example6

external 接受一个模块名称的数组或一个接受模块名称的函数(如果它被视为外部引用（externals）则返回true)  

安装 `lodash`： `npm i -S lodash`  

在 `src/example6` 文件夹中新建 `main.js` 和 `rollup.config.js`  
```
// main.js
import answer from 'the-answer';
import _ from 'lodash';

// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/example6/main.js',
    output: {
        file: 'dist/example6/bundle.js',
        format: 'umd',
        name: 'example6'
    },
    plugins: [
        resolve()
    ],
    external: ['lodash']
}
```
配置文件中加入 `external` 就不会把第三方的库打包进我们最后的文件了。可以在 `src/example5/rollup.config.js` 中把 `external` 注释掉看看打包后的文件，会把整个 `lodsh` 打包进来。  
*扩展：* 如果用到 `lodsh` ，可以使用  [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash) 来最优选择lodash模块。  

### example7

我们在项目中有很大概率用到 `babel` ，使用 Babel 和 Rollup 的最简单方法是使用 [rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel)  

安装： `npm i -D rollup-plugin-babel`  

在 `src/example7`文件夹下新建 `main.js` `.babelrc` `rollup.config.js`  
```
//main.js
import answer from 'the-answer';

export default function () {
    console.log(`the answer is ${answer}`);
}

//.babelrc
{
    "presets": [
        ["env",{
            "modules": false
        }]
    ],
    "plugins": [
        "external-helpers"
    ]
}

//rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/example7/main.js',
    output: {
        file: 'dist/example7/bundle.js',
        format: 'cjs'
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**',
            externalHelpers: true
        })
    ]
}
```  
安装： `npm i -D babel-core babel-preset-env babel-plugin-external-helpers`

运行：`rollup -c src/example7/rollup.config.js`  

```
// dist/example7/bundle.js
'use strict';

var index = 42;

function main () {
    // 转成了ES5的语法了
    console.log('the answer is ' + index);
}

module.exports = main;

```

*说明*  
* `babel-plugin-external-helpers` 这个模块是在 `.babelrc` 文件中体现，目的是让babel转义出来的帮助性代码只在该文件的头部出现一次，而不会再每个引入的模块中加入，如果不想把这些帮助性的代码打包进你的文件，需要在rollup的配置文件中加入 `externalHelpers: true`，这样就会引用一个全局的`babelHelpers` 对象


### 推荐资料  

* [rollup.js 中文文档](http://www.rollupjs.com/)
* [Rollup 插件列表](https://github.com/rollup/rollup/wiki/Plugins)







