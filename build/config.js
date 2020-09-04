const path = require('path');
function resolvePath(resolvePath) {
  return path.resolve(__dirname, '../', resolvePath);
}
exports.resolvePath = resolvePath;

exports.alias = {
  'ale-ui': resolvePath('./'),
  '@main': resolvePath('./src'),
  '@demo': resolvePath('./examples'),
  '@types': resolvePath('./types'),
  '@styles': resolvePath('./packages/theme-chalk/src'),
  '@mixins': resolvePath('./src/mixins'),
  '@utils': resolvePath('./src/utils'),
  '@locale': resolvePath('./src/locale'),
  '@components': resolvePath('./packages'),
  '@directives': resolvePath('./src/directives'),
  '@form': resolvePath('./packages/form/src')
};

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/;
