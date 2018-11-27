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

  var Observer = function () {
      function Observer(data) {
          classCallCheck(this, Observer);

          this.observer(data);
      }

      createClass(Observer, [{
          key: 'observer',
          value: function observer(data) {
              var _this = this;

              if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
                  return;
              }
              Object.keys(data).forEach(function (key) {
                  _this.defineReactive(data, key, data[key]);
                  _this.observer(data[key]); // 深度劫持
              });
          }
      }, {
          key: 'defineReactive',
          value: function defineReactive(obj, key, value) {
              var that = this;
              var dep = new Dep();
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
              this.subs.push(watcher);
              this.watcherId.push(watcher.id);
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
          this.expOrFn = expOrFn;
          this.cb = cb;
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
              var value = this.getter.call(this.vm, this.vm.data);
              Dep.target = null;
              return value;
          }
      }, {
          key: 'update',
          value: function update() {
              var value = this.get();
              var oldVal = this.value;
              if (value !== oldVal) {
                  this.value = value;
                  this.cb.call(this.vm, value, oldVal);
              }
          }
      }, {
          key: 'parseGetter',
          value: function parseGetter(expOrFn) {
              if (/[^\w.$]/.test(expOrFn)) return;
              var exps = expOrFn.split(".");
              return function (obj) {
                  exps.forEach(function (exp) {
                      obj = obj[exp];
                  });
                  return obj;
              };
          }
      }]);
      return watcher;
  }();

  var compile = function () {
      function compile(el, data) {
          classCallCheck(this, compile);

          this.$el = document.querySelector(el);
          this.data = data;
          this.updateFn = {
              expressGet: function expressGet(path) {
                  path = path.split('.');
                  var boby = 'if (o !=null';
                  var pathString = 'o';
                  var key = void 0;
                  for (var i = 0; i < path.length - 1; i++) {
                      key = path[i];
                      pathString += '.' + key;
                      boby += ' && ' + pathString + ' != null';
                  }
                  key = path[path.length - 1];
                  pathString += '.' + key;
                  boby += ') return ' + pathString;
                  return new Function('o', boby);
              },
              setVal: function setVal(data, exp, newVal) {
                  exp = exp.split(".");
                  return exp.reduce(function (prev, next, currentIndex) {
                      // 如果当前归并的为数组的最后一项，则将新值设置到该属性
                      if (currentIndex === exp.length - 1) {
                          return prev[next] = newVal;
                      }

                      // 继续归并
                      return prev[next];
                  }, data);
              },
              getval: function getval(data, expr) {
                  var get$$1 = this.expressGet(expr);
                  return get$$1(data);
              },
              text: function text(node, value) {
                  node.textContent = value;
              },
              model: function model(node, value, modelbind) {
                  var _this = this;

                  node.value = value;
                  if (modelbind) {
                      node.addEventListener('input', function (e) {
                          // 获取输入的新值
                          var newValue = e.target.value;

                          // 更新到节点
                          _this.setVal(modelbind.data, modelbind.expr, newValue);
                      });
                  }
              }
          };
          new Observer(this.data);
          var fragment = this.node2fragment();
          this.compile(fragment);
          this.$el.appendChild(fragment);
      }

      createClass(compile, [{
          key: 'node2fragment',
          value: function node2fragment() {
              var fragment = document.createDocumentFragment();
              var child = void 0;
              while (child = this.$el.firstChild) {
                  fragment.appendChild(child);
              }
              return fragment;
          }
      }, {
          key: 'compile',
          value: function compile(fragment) {
              var _this2 = this;

              var childNodes = fragment.childNodes;
              Array.from(childNodes).forEach(function (node) {
                  if (_this2.isElementNode(node)) {
                      _this2.compileElement(node);
                      _this2.compile(node);
                  } else {
                      _this2.compileText(node, _this2.data);
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
              return node.nodeType === 1;
          }
      }, {
          key: 'compileElement',
          value: function compileElement(node) {
              var _this3 = this;

              var attrs = node.attributes;
              Array.from(attrs).forEach(function (attr) {
                  var attrName = attr.name;
                  if (_this3.isDirective(attrName)) {
                      var expr = attr.value;

                      var _attrName$split = attrName.split("-"),
                          _attrName$split2 = slicedToArray(_attrName$split, 2),
                          type = _attrName$split2[1];

                      var value = _this3.updateFn.getval(_this3.data, expr);
                      _this3.updateFn[type](node, value, { data: _this3.data, expr: expr });
                      new watcher(_this3, expr, function (newVal) {
                          _this3.updateFn[type](node, newVal);
                      });
                  }
              });
          }
      }, {
          key: 'compileText',
          value: function compileText(node, data) {
              var _this4 = this;

              var expr = node.textContent; //取文本中的内容
              var reg = /\{\{([^}]+)\}\}/g;
              var val = expr.replace(reg, function () {
                  expr = arguments.length <= 1 ? undefined : arguments[1];
                  new watcher(_this4, arguments.length <= 1 ? undefined : arguments[1], function (newVal) {
                      _this4.updateFn.text(node, newVal);
                  });
                  return _this4.updateFn.getval(data, arguments.length <= 1 ? undefined : arguments[1]);
              });
              this.updateFn.text(node, val);
          }
      }]);
      return compile;
  }();

  var Vue = function Vue(options) {
      classCallCheck(this, Vue);

      this.$el = options.el;
      this.data = options.data;
      if (this.$el) {
          new compile(this.$el, this.data);
      }
  };

  return Vue;

})));
