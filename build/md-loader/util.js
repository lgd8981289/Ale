const compiler = require('@vue/compiler-dom');

function stripScript(content) {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

function stripStyle(content) {
  const result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

// 编写例子时不一定有 template。所以采取的方案是剔除其他的内容
function stripTemplate(content) {
  content = content.trim();
  if (!content) {
    return content;
  }
  content = content.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim();
  // 过滤<template>
  const ret = content.match(/<(template)\s*>([\s\S]+)<\/\1>/);
  return ret ? ret[2].trim() : content;
}

function genInlineComponentText(template, script) {
  const compiled = compiler.compile(template, { prefixIdentifiers: true });

  const code = compiled.code.replace(/return\s+?function\s+?render/, () => {
    return 'function render ';
  });

  let demoComponentContent = `
    ${code}
  `;

  // todo: 这里采用了硬编码有待改进
  script = script.trim();
  if (script) {
    script = script
      .replace(/export\s+default/, 'const democomponentExport =')
      .replace(/import ([,{}\w\s]+) from ['"\w]+/g, function(s0, s1) {
        return `const ${s1} = Vue`;
      });
  } else {
    script = 'const democomponentExport = {}';
  }
  demoComponentContent = `(function() {
    ${demoComponentContent}
    ${script}
    return {
      mounted(){
        this.$nextTick(()=>{
          const blocks = document.querySelectorAll('pre code:not(.hljs)')
          Array.prototype.forEach.call(blocks, hljs.highlightBlock)
        })
      },
      render,
      ...democomponentExport
    }
  })()`;
  return demoComponentContent;
}

module.exports = {
  stripScript,
  stripStyle,
  stripTemplate,
  genInlineComponentText
};
