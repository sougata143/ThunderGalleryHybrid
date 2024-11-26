module.exports = function (api) {
  api.cache(true);
  
  const presets = ['babel-preset-expo'];
  const plugins = [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './app',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ];

  if (process.env.NODE_ENV === 'production') {
    plugins.push(['transform-remove-console', {
      exclude: ['error', 'warn']
    }]);
  }

  return {
    presets,
    plugins,
  };
};