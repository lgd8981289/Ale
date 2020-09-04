module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
        }
      }
    ]
  ];
  const plugins = [
    '@babel/plugin-transform-runtime',
    '@vue/babel-plugin-jsx',
    [
      'module-resolver',
      {
        root: ['ale-ui'],
        alias: {
          'ale-ui/src': 'ale-ui/lib'
        }
      }
    ]
  ];

  return {
    presets,
    plugins
  };
};
