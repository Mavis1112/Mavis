# CMD与AMD模块化规范
---
## 一、CMD
- Common Module Definition
- 中文名：通用模块定义
- 代表：seaJS
### 1.定义
```java
define(factory);
defint(function(require,exports,module){
  //模块代码
});
```
**define**是一个全局函数，用来定义模块。</br>

参数**factory**可以是一个函数，也可以是一个对象或字符串。</br>

**factory** 为**对象、字符串**时，表示模块的接口就是该对象、字符串。比如可以如下定义一个 JSON 数据模块:</br>
```javascript
//mod.js
define({"name":"Mavis"})；
```
也可以通过字符串定义模板模块：
```javascript
//mod.js
define('I am a template. My name is {{name}}.');
```
**factory** 为**函数**时，有三个参数：
1. **require** 是一个方法，接受模块标识作为唯一参数，用来获取其他模块提供的接口：require(id)
```javascript
//mod2.js 引用 mod.js
define(function)(function (require,exports,module) {
  let c = requier('./mod.js');
  exports.res = c.a + c.b;
});
2. **exports** 是一个对象，用来向外提供模块接口
```javascript
//mod.js
define(function (require,exports,module) {
  exports.a = 12;
  exports.b = 5;

});
```
3. **module** 是一个对象，上面存储了与当前模块相关联的一些属性和方法
```javascript
//mod.js
define(function (require, exports, module){
  //module——批量导出
  module.exports={
    a : 12,
    b : 5,
    show(a, b){
      alert(a+b);
    }
  };
});
```
### 2.引用
```javascript
//1.html
seajs.use(['mod.js','xxx.js','xxx.js',...],function (a,b,...) {
//xxx
});
```
注：　html引用js　：use</br>
　　　js　引用js　: requier


## 二、AMD
- Asynchronous Module Definition
- 中文名：异步模块定义
- 代表：requireJS

### 1.定义
```javascript
define(id?, dependencies?, factory);
```
本规范只定义了一个函数 "define"，它是全局变量。
1. **id**：可选参数，用来定义模块的标识，如果没有提供该参数，脚本文件名（去掉拓展名）
2. **dependencies**：是一个当前模块依赖的模块名称数组。本规范定义了三种特殊的依赖关键字。如果"require","exports", 或 "module"出现在依赖列表中，参数应该按照CommonJS模块规范自由变量去解析
3. **factory**：工厂方法，模块初始化要执行的函数或对象。如果为函数，它应该只被执行一次。如果是对象，此对象应该为模块的输出值。

**使用require和exports**创建一个名为"alpha"的模块，使用了require，exports，和名为"beta"的模块:
```javascript
define("alpha", ["require", "exports", "beta"], function (require, exports, beta) {
      exports.verb = function() {
          return beta.verb();
          //Or:
          return require("beta").verb();
      }
  });
```
一个返回对象的匿名模块：
``` javascript
define({
  add: function(x, y){
    return x + y;
  }
});
```
一个使用了简单CommonJS转换的模块定义：
```javascript
define(function (require, exports, module) {
  var a = require('a'),
      b = require('b');

  exports.action = function () {};
});
```
## 三、AMD与CMD区别
AMD和CMD最大的区别是对依赖模块的执行时机处理不同，注意不是加载的时机或者方式不同.
1. **AMD**推崇**依赖前置**，在定义模块的时候就要声明其依赖的模块(**提前执行**)
2. **CMD**推崇**就近依赖**，只有在用到某个模块的时候再去require（**延迟执行**）

这种区别各有优劣，只是语法上的差距，且requireJS和SeaJS都支持对方的写法。
