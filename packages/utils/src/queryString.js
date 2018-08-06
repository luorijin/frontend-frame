export function parse(query){
    if (typeof query !== 'string') {
		return {};
    }
    let abj={},reg=/^([^&]*)=([^&]*)(&|$)/,matchs=[];
    while(matchs=query.match(reg)){
        abj[matchs[1]]=decodeURIComponent(matchs[2]);
        query=query.substring(matchs[0].length);
    }
    return abj;
}
export function parseUrl(href,options){
  let location = href.split('?');
  return {
      url:location[0]||'',
      query:parse(location[1]||'')
  }
}
const queryString={
    parse,
    parseUrl
}
export default queryString;