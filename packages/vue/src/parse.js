export default function parse(text){//表达式拆分{{user}}kk=>['{{user}}','kk']
  let tagRE = /{{(.+?)}}|{{{(.+?)}}}/g;
  let tokens = [],
        match, index, value, lastIndex = 0;
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