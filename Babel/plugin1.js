const babel = require("@babel/core");
const c = `import {A, B, C as D} from 'foo'`;

const MODULE = "foo";
const { code } = babel.transform(c, {
  plugins: [
    function ({ types: t }) {
      return {
        visitor: {
          ImportDeclaration(path) {
            if (path.node.source.value !== MODULE) return;

            const specs = path.node.specifiers;
            if (specs.length === 0) {
              path.remove();
              return;
            }

            // 判断是否包含了默认导入和命名空间导入
            if (
              specs.some(
                (i) =>
                  t.isImportDefaultSpecifier(i) ||
                  t.isImportNamespaceSpecifier(i)
              )
            ) {
              // 抛出错误，Babel会展示出错的代码帧
              throw path.buildCodeFrameError("不能使用默认导入或命名空间导入");
            }
          },
        },
      };
    },
  ],
});
