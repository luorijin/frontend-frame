/*!
 * vue.js v1.0.0
 * (c) 2018-2018 luo
 * Released under the MIT License.
 */
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Vue = factory());
}(this, (function () { 'use strict';

  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }
  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = original.apply(this, args);
      var dep = this.__dep__;
      console.info("dep", dep);
      dep.notify();
      return result;
    });
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  /**
   * Augment an target Object or Array by intercepting
   * the prototype chain using __proto__
   *
   * @param {Object|Array} target
   * @param {Object} src
   */

  function protoAugment(target, src) {
      //重写数组方法依赖
      /* eslint-disable no-proto */
      target.__proto__ = src;
      /* eslint-enable no-proto */
  }

  /**
   * Augment an target Object or Array by defining
   * hidden properties.
   *
   * @param {Object|Array} target
   * @param {Object} proto
   */

  function copyAugment(target, src, keys) {
      //重写数组方法依赖
      for (var i = 0, l = keys.length; i < l; i++) {
          var key = keys[i];
          def(target, key, src[key]);
      }
  }
  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  var Observer = function () {
      function Observer(data) {
          classCallCheck(this, Observer);

          this.observer(data);
      }

      createClass(Observer, [{
          key: 'observer',
          value: function observer(data) {
              var _this = this;

              if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || data.isAbserve) {
                  return;
              }
              if (Array.isArray(data)) {
                  var augment = '__proto__' in {} ? protoAugment : copyAugment;
                  augment(data, arrayMethods, arrayKeys);
                  this.observeArray(data);
                  return;
              }
              Object.keys(data).forEach(function (key) {
                  _this.defineReactive(data, key, data[key]);
                  data.isAbserve = true;
                  _this.observer(data[key]); // 深度劫持
              });
          }
      }, {
          key: 'observeArray',
          value: function observeArray(items) {
              for (var i = 0, l = items.length; i < l; i++) {
                  this.observer(items[i]);
              }
          }
      }, {
          key: 'defineReactive',
          value: function defineReactive(obj, key, value) {
              var that = this;
              var dep = new Dep();
              //如果是数组，把dep挂载在上面
              if (Array.isArray(value)) {
                  def(value, '__dep__', dep);
              }
              Object.defineProperty(obj, key, {
                  enumerable: true,
                  configurable: true,
                  get: function get$$1() {
                      Dep.target && dep.addSub(Dep.target);
                      return value;
                  },
                  set: function set$$1(newValue) {
                      if (newValue !== value) {
                          that.observer(newValue); // 如果是对象继续劫持
                          value = newValue;
                          dep.notify();
                      }
                  }
              });
          }
      }]);
      return Observer;
  }();

  var Dep = function () {
      function Dep() {
          classCallCheck(this, Dep);

          this.watcherId = [];
          this.subs = [];
      }

      createClass(Dep, [{
          key: 'addSub',
          value: function addSub(watcher) {
              if (this.watcherId.indexOf(watcher.id) !== -1) return;
              watcher.deps.push(this);
              this.subs.push(watcher);
              this.watcherId.push(watcher.id);
          }
      }, {
          key: 'removeSub',
          value: function removeSub(watcher) {
              var index = this.subs.indexOf(watcher.id);
              if (index !== -1) {
                  this.subs.splice(index, 1);
              }
          }
      }, {
          key: 'notify',
          value: function notify() {
              this.subs.forEach(function (watcher) {
                  return watcher.update();
              });
          }
      }]);
      return Dep;
  }();

  var uid = 0;

  var watcher = function () {
      function watcher(vm, expOrFn, cb) {
          classCallCheck(this, watcher);

          this.vm = vm;
          this.vm._watchers.push(this);
          this.expOrFn = expOrFn;
          this.cb = cb;
          this.deps = [];
          this.id = uid++;
          if (typeof expOrFn === 'function') {
              this.getter = expOrFn;
          } else {
              this.getter = this.parseGetter(expOrFn);
          }
          this.value = this.get();
      }

      createClass(watcher, [{
          key: 'get',
          value: function get$$1() {
              Dep.target = this;
              var value = this.getter.call(this, this.vm.data);
              Dep.target = null;
              return value;
          }
      }, {
          key: 'update',
          value: function update() {
              var value = this.get();
              this.cb.call(this.vm, value);
          }
      }, {
          key: 'getVar',
          value: function getVar(code) {
              var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
              var SPLIT_RE = /[^\w$]+/g;
              var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
              var BOUNDARY_RE = /^,+|,+$/g;
              var SPLIT2_RE = /^$|,+/;
              return code.replace(REMOVE_RE, '').replace(SPLIT_RE, ',').replace(NUMBER_RE, '').replace(BOUNDARY_RE, '').split(SPLIT2_RE);
          }
      }, {
          key: 'parseGetter',
          value: function parseGetter(expOrFn) {
              console.log(this.getVar(expOrFn));
              var body = [];
              this.getVar(expOrFn).forEach(function (name) {
                  body.push('let ' + name + ' = data.' + name + ';');
              });
              body.push(' return ' + expOrFn + ';');
              return new Function("data", body.join(''));
          }
      }]);
      return watcher;
  }();

  var dom = function () {
      function dom() {
          classCallCheck(this, dom);
      }

      createClass(dom, [{
          key: "repalce",
          value: function repalce(target, el) {
              var parent = target.parentNode;
              parent.insertBefore(el, target);
              parent.removeChild(target);
          }
      }, {
          key: "before",
          value: function before(el, target) {
              target.parentNode.insertBefore(el, target);
          }
      }, {
          key: "after",
          value: function after(el, target) {
              if (target.nextSibling) {
                  this.before(el, target.nextSibling);
              } else {
                  target.parentNode.appendChild(el);
              }
          }
      }, {
          key: "remove",
          value: function remove(el) {
              el.parentNode.removeChild(el);
          }
      }]);
      return dom;
  }();

  var uid$1 = 0;

  var repeat = function (_dom) {
      inherits(repeat, _dom);

      function repeat(el, expr, vm) {
          classCallCheck(this, repeat);

          var _this = possibleConstructorReturn(this, (repeat.__proto__ || Object.getPrototypeOf(repeat)).call(this));

          _this.id = '_repeat_' + uid$1++;
          _this.$parent = vm;
          _this.expr = expr;
          _this.cacheVm = [];
          el.removeAttribute('v-for');
          _this.$el = el;
          _this.ref = document.createComment("v-repeat");
          el.childCompile = true;
          _this.repalce(el, _this.ref);
          _this.Gedescriptor();
          _this.build();
          new watcher(vm, _this.expr, function () {
              _this.build();
          });
          return _this;
      }

      createClass(repeat, [{
          key: 'Gedescriptor',
          value: function Gedescriptor() {
              //生成描述
              var inMatch = this.expr.match(/(.*) (?:in|of) (.*)/);
              if (inMatch) {
                  var itMatch = inMatch[1].match(/\((.*),(.*)\)/);
                  if (itMatch) {
                      // v-for="{k,v} in array"的形式,iterator就是'k',别名为v
                      this.iterator = itMatch[1].trim();
                      this.alias = itMatch[2].trim();
                  } else {
                      // v-for="ele in array"的形式,别名为ele
                      this.alias = inMatch[1].trim();
                  }
                  this.expr = inMatch[2];
              }
          }
      }, {
          key: 'getScope',
          value: function getScope(data) {
              //生成作用域
              var scope = Object.create(this.$parent.data);
              console.log(scope);
              scope[this.alias] = data;
              return scope;
          }
      }, {
          key: 'build',
          value: function build() {
              var _this2 = this;

              var data = this.$parent.data[this.expr];
              var newVms = [];
              var oldVms = this.cacheVm;
              for (var i = 0; i < data.length; i++) {
                  var cachevm = data[i][this.id];
                  if (!cachevm) {
                      var scope = this.getScope(data[i]);
                      var vm = new Vue({
                          el: this.$el.cloneNode(true),
                          data: scope,
                          iSappend: false
                      });
                      newVms.push(vm);
                      data[i][this.id] = vm;
                      this.before(vm.fragment, this.ref);
                  } else {
                      cachevm.reused = true;
                      this.before(cachevm.fragment, this.ref);
                      newVms.push(cachevm);
                  }
              }
              oldVms.forEach(function (ovm) {
                  if (ovm.reused) {
                      ovm.reused = false;
                  } else {
                      _this2.remove(ovm.$el);
                      ovm.distory();
                  }
              });
              this.cacheVm = newVms;
          }
      }]);
      return repeat;
  }(dom);

  var uid$2 = 0;

  var vIf = function (_dom) {
      inherits(vIf, _dom);

      function vIf(el, expr, vm) {
          classCallCheck(this, vIf);

          var _this = possibleConstructorReturn(this, (vIf.__proto__ || Object.getPrototypeOf(vIf)).call(this));

          _this.$el = el;
          _this.expr = expr;
          _this.$parent = vm;
          el.removeAttribute('v-if');
          _this.ifCondicition = [{ block: el, expr: expr }];
          _this.ref = document.createComment('if_' + uid$2++);
          el.childCompile = true;
          _this.getElse(_this.$el.nextElementSibling);
          _this.repalce(el, _this.ref);
          _this.render();
          return _this;
      }

      createClass(vIf, [{
          key: 'getElse',
          value: function getElse(nextElem) {
              if (!nextElem) return;
              if (nextElem.hasAttribute("v-else-if")) {
                  var expr = nextElem.getAttribute("v-else-if");
                  nextElem.removeAttribute("v-else-if");
                  this.ifCondicition.push({ block: nextElem, expr: expr });
                  var NnextElem = nextElem.nextElementSibling;
                  this.remove(nextElem);
                  this.getElse(NnextElem);
                  nextElem.childCompile = true;
              } else if (nextElem.hasAttribute("v-else")) {
                  nextElem.removeAttribute("v-else");
                  nextElem.childCompile = true;
                  this.hasElse = { block: nextElem };
                  this.remove(nextElem);
              }
          }
      }, {
          key: 'getVar',
          value: function getVar(code) {
              var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
              var SPLIT_RE = /[^\w$]+/g;
              var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
              var BOUNDARY_RE = /^,+|,+$/g;
              var SPLIT2_RE = /^$|,+/;
              return code.replace(REMOVE_RE, '').replace(SPLIT_RE, ',').replace(NUMBER_RE, '').replace(BOUNDARY_RE, '').split(SPLIT2_RE);
          }
      }, {
          key: 'expressGet',
          value: function expressGet(path) {
              var body = [];
              this.getVar(path).forEach(function (name) {
                  body.push('let ' + name + ' = data.' + name + ';');
              });
              body.push(' return ' + path + ';');
              return new Function("data", body.join(''));
          }
      }, {
          key: 'render',
          value: function render() {
              var _this2 = this;

              var data = this.$parent.data;
              var ifCondicition = this.ifCondicition;
              var oldVm = this.vm;
              var ifDes = { Condicition: false };

              if (oldVm) {
                  this.remove(oldVm.$el);
                  oldVm.distory();
              }
              for (var i = 0; i < ifCondicition.length; i++) {
                  if (this.expressGet(ifCondicition[i].expr)(data)) {
                      ifDes.Condicition = ifCondicition[i];
                      break;
                  }
              }
              if (!ifDes.Condicition && this.hasElse) {
                  ifDes.Condicition = this.hasElse;
              }
              if (ifDes.Condicition) {
                  var vm = new Vue({
                      data: data,
                      scopeType: "parent",
                      el: ifDes.Condicition.block.cloneNode(true),
                      iSappend: false
                  });
                  this.before(vm.fragment, this.ref);
                  this.vm = vm;
                  new watcher(vm, ifCondicition[0].expr, function () {
                      _this2.render();
                  });
              }
              return;
          }
      }]);
      return vIf;
  }(dom);

  function parse(text) {
      //表达式拆分{{user}}kk=>['{{user}}','kk']
      var tagRE = /{{(.+?)}}|{{{(.+?)}}}/g;
      var tokens = [],
          match = void 0,
          index = void 0,
          value = void 0,
          lastIndex = 0;
      tagRE.lastIndex = 0;
      while (match = tagRE.exec(text)) {
          index = match.index;
          if (index > lastIndex) {
              tokens.push({
                  value: text.slice(lastIndex, index)
              });
          }
          index = match.index;
          value = match[1];
          tokens.push({
              tag: true,
              value: value.trim()
          });
          lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length - 1) {
          tokens.push({
              value: text.slice(lastIndex)
          });
      }
      return tokens;
  }

  var compile = function (_dom) {
      inherits(compile, _dom);

      function compile(vm) {
          classCallCheck(this, compile);

          var _this = possibleConstructorReturn(this, (compile.__proto__ || Object.getPrototypeOf(compile)).call(this));

          _this.$el = vm.$el;
          _this.data = vm.data;
          _this.vm = vm;
          _this.updateFn = {
              expressGet: function expressGet(path) {
                  var body = [];
                  this.getVar(path).forEach(function (name) {
                      body.push('let ' + name + ' = data.' + name + ';');
                  });
                  body.push(' return ' + path + ';');
                  return new Function("data", body.join(''));
              },
              getVar: function getVar(code) {
                  var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
                  var SPLIT_RE = /[^\w$]+/g;
                  var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
                  var BOUNDARY_RE = /^,+|,+$/g;
                  var SPLIT2_RE = /^$|,+/;
                  return code.replace(REMOVE_RE, '').replace(SPLIT_RE, ',').replace(NUMBER_RE, '').replace(BOUNDARY_RE, '').split(SPLIT2_RE);
              },
              setVal: function setVal(data, exp, newVal) {

                  new Function("data", 'data.' + exp + ' =\'' + newVal + '\';return true')(data);
              },
              getval: function getval(expr) {
                  var get$$1 = this.expressGet(expr);
                  return get$$1(vm.data);
              },
              setText: function setText(node, value) {
                  node.textContent = value;
              },
              text: function text(node, expr) {
                  var _this2 = this;

                  this.setText(node, this.getval(expr));
                  new watcher(vm, expr, function (newVal) {
                      _this2.setText(node, newVal);
                  });
              },
              setModel: function setModel(node, value) {
                  node.value = value;
              },
              model: function model(node, expr) {
                  var _this3 = this;

                  this.setModel(node, this.getval(expr));
                  node.addEventListener('input', function (e) {
                      // 获取输入的新值
                      var newValue = e.target.value;

                      // 更新到节点
                      _this3.setVal(vm.data, expr, newValue);
                  });
                  new watcher(vm, expr, function (newVal) {
                      _this3.setModel(node, newVal);
                  });
              },
              for: function _for(node, expr) {
                  console.log(new repeat(node, expr, vm));
              },
              if: function _if(node, expr) {
                  new vIf(node, expr, vm);
              }
          };
          if (vm.scopeType !== "parent") {
              new Observer(_this.data);
          }
          var iSappend = vm.iSappend; //是否append到跟元素
          var fragment = vm.fragment = _this.node2fragment(iSappend);
          _this.compile(fragment);
          if (iSappend) {
              _this.$el.appendChild(fragment);
          }
          return _this;
      }

      createClass(compile, [{
          key: 'node2fragment',
          value: function node2fragment(iSappend) {
              var fragment = document.createDocumentFragment();
              if (iSappend) {
                  var child = void 0;
                  while (child = this.$el.firstChild) {
                      fragment.appendChild(child);
                  }
              } else {
                  fragment.append(this.$el);
              }
              return fragment;
          }
      }, {
          key: 'compile',
          value: function compile(fragment) {
              var _this4 = this;

              var childNodes = fragment.childNodes;
              Array.from(childNodes).forEach(function (node) {
                  var nodeType = _this4.isElementNode(node);
                  if (nodeType === 1) {
                      _this4.compileElement(node);
                      if (!node.childCompile) {
                          _this4.compile(node);
                      }
                  } else if (nodeType === 3) {
                      _this4.compileText(node, _this4.data);
                  } else {
                      return false;
                  }
              });
          }
      }, {
          key: 'isDirective',
          value: function isDirective(name) {
              return name.startsWith("v-");
          }
      }, {
          key: 'isElementNode',
          value: function isElementNode(node) {
              // 判断是否为元素及节点，用于递归遍历节点条件
              return node.nodeType;
          }
      }, {
          key: 'compileElement',
          value: function compileElement(node) {
              var _this5 = this;

              var attrs = node.attributes;
              Array.from(attrs).forEach(function (attr) {
                  var attrName = attr.name;
                  if (_this5.isDirective(attrName)) {
                      var expr = attr.value;

                      var _attrName$split = attrName.split("-"),
                          _attrName$split2 = slicedToArray(_attrName$split, 2),
                          type = _attrName$split2[1];

                      if (type == "else") return;
                      _this5.updateFn[type](node, expr);
                  }
              });
          }
      }, {
          key: 'compileText',
          value: function compileText(node) {
              var _this6 = this;

              var expr = node.textContent; //取文本中的内容
              var tokens = parse(expr);
              if (tokens) {
                  tokens.forEach(function (token) {
                      if (token.tag) {
                          // 指令节点
                          var value = token.value;
                          var el = document.createTextNode('');
                          _this6.before(el, node);
                          _this6.updateFn.text(el, value);
                      } else {
                          // 普通文本节点
                          console.log(token.value);
                          var _el = document.createTextNode(token.value);
                          _this6.before(_el, node);
                      }
                  });
                  this.remove(node);
              }
          }
      }]);
      return compile;
  }(dom);

  var Vue = function () {
      function Vue(options) {
          classCallCheck(this, Vue);

          var opt = {
              el: "#app",
              data: [],
              iSappend: true
          };
          this.extend(opt, options);
          this.$el = typeof opt.el === 'string' ? document.querySelector(opt.el) : opt.el;
          this.data = opt.data;
          this.iSappend = opt.iSappend;
          this._watchers = [];
          if (this.$el) {
              new compile(this);
          }
      }

      createClass(Vue, [{
          key: 'extend',
          value: function extend(to, from) {
              for (var key in from) {
                  to[key] = from[key];
              }
          }
      }, {
          key: 'distory',
          value: function distory() {
              this._watchers.forEach(function (watcher) {
                  watcher.deps.forEach(function (dep) {
                      dep.removeSub(watcher);
                  });
              });
          }
      }]);
      return Vue;
  }();

  return Vue;

})));
