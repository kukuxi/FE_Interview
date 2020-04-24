/*
目标：
var tpl = new Template('<p>Today: { date }</p>\n<a href="/{ user.id|safe }">{ user.company }</a>');
// 渲染得到HTML片段:
var model = {
    date: 20150316,
    user: {
        id: 'A-000&001',
        company: 'AT&T'
    }
};
var html = tpl.render(model);
console.log(html);
// <p>Today: 20150316</p>
// <a href="/A-000&001">AT&amp;T</a>
*/

function tplEngine(tpl, data) {
  const reg = /<%([^%>]+)?%>/g,
    regOut = /(^\s?(if|for|else|switch|case|break|{|}))/g;
  let code = "var r = [];\n",
    cursor = 0;

  const add = function (line, js) {
    if (js) {
      code += line.match(regOut) ? line + "\n" : `r.push("${line}");\n`;
    } else {
      code += line === "" ? "" : `r.push(${line.replace(/"/g, ' /"/')});\n`;
    }

    return add;
  };

  while ((match = reg.exec(tpl))) {
    const pre = tpl.slice(cursor, match.index);
    add(pre)(match[1], true);
    cursor = match.index + match[1].length;
  }

  const rest = tpl.substr(cursor, tpl.length - cursor);
  add(rest);
  code += 'return r.join("")';

  return new Function(code.replace(/[\r\t\n]/g, "")).apply(data);
}
