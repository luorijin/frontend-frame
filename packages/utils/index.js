/*!
 * utils.js v1.0.0
 * (c) 2018-2018 luo
 * Released under the MIT License.
 */
function parse(query) {
    if (typeof query !== 'string') {
        return {};
    }
    var abj = {},
        reg = /^([^&]*)=([^&]*)(&|$)/,
        matchs = [];
    while (matchs = query.match(reg)) {
        abj[matchs[1]] = decodeURIComponent(matchs[2]);
        query = query.substring(matchs[0].length);
    }
    return abj;
}
function parseUrl(href, options) {
    var location = href.split('?');
    return {
        url: location[0] || '',
        query: parse(location[1] || '')
    };
}
var queryString = {
    parse: parse,
    parseUrl: parseUrl
};

export default queryString;
