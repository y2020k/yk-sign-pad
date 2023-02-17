/*
createTime:2023/2/17 10:46
path:plugins
proName:yk-component
fileName:VitePluginStyleMove
author:俞棵
remark:
*/

import type { Plugin } from 'vite';

export default function Index(styleId = ''): Plugin {
  let styleCode = '';

  return {
    name: 'vite-plugin-style-move',
    apply: 'build', // 应用模式
    enforce: 'post', // 作用阶段
    generateBundle(_, bundle) {
      // 遍历bundle找css
      for (let key in bundle) {
        const chunk = bundle[key];
        if (chunk && chunk.type === 'asset' && chunk.fileName.includes('.css')) {
          styleCode += chunk.source;
          delete bundle[key];
        }
      }
      // 遍历bundle添加css
      for (let key in bundle) {
        const chunk = bundle[key];
        if (chunk) {
          if (chunk.type === 'chunk' &&
            chunk.fileName.match(/.[cm]?js$/) !== null &&
            !chunk.fileName.includes('polyfill')
          ) {
            // 保存原有代码
            const sourceCode = chunk.code;
            // 添加css
            chunk.code = '(function(){ try {var elementStyle = document.createElement(\'style\'); elementStyle.appendChild(document.createTextNode(';
            chunk.code += JSON.stringify(styleCode.trim());
            chunk.code += ')); ';
            // + 判断是否添加id
            if (styleId.length > 0)
              chunk.code += ` elementStyle.id = "${styleId}"; `;
            chunk.code += 'document.head.appendChild(elementStyle);} catch(e) {console.error(\'vite-plugin-style-move-by-js\', e);} })();';
            chunk.code += sourceCode;
            break; // 一个bundle插入一次即可
          }
        }
      }
    }
  };
}
