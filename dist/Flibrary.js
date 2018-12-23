/*!
 * function-library.js v1.0.0
 * (c) 2018-2018 luo
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Flibrary = factory());
}(this, (function () { 'use strict';

    var index = (function (c) {
        return c + "+1+2";
    });

    return index;

})));
