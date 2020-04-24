const babel = require("@babel/core");
var c = `
const a = 1, b = 2
function add(foo, bar) {
  console.log(a, b)
  return () => {
    const a = '1' // 新增了一个变量声明
    return a + (foo + bar)
  }
}
`;

const getUid = () => {
  let uid = 0;
  return () => `_${uid++ || ""}`;
};
const { code } = babel.transform(c, {
  plugins: [
    function ({ types: t }) {
      return {
        visitor: {
          FunctionDeclaration(path) {
            const firstParam = path.get("params.0");

            if (firstParam == null) return;

            let i = path.scope.generateUid("_");
            path.scope.rename(firstParam.node.name, i);
          },
        },
      };
    },
  ],
});

console.log(code);
