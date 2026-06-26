const isTargetWeb = api =>
  api.caller((caller) => caller && caller.target === 'web');

module.exports = (api) => {
  const babelPresetEnvOptions = {
    // debug: true, // <-- Enable if you want to debug what babel is doing
    // useBuiltIns: 'usage',
    // corejs: 3.39,
    // modules: false
  };
  if (!isTargetWeb(api)) {
    // change babel compile target for node
    babelPresetEnvOptions.targets = { node: 'current' };
  }

  return {
    presets: [
      ['@babel/preset-react', {
        'runtime': 'automatic' // Starting from Babel 8, "automatic" will be the default runtime
      }],
      '@babel/preset-typescript',
      // [
      //   '@babel/preset-env',
      //   babelPresetEnvOptions
      // ]
    ],
    // overrides: [
    //   {
    //     test: /\.tsx$/,
    //     presets: [
    //       ['@babel/preset-react', { runtime: 'automatic' }],
    //       '@babel/preset-typescript'
    //     ]
    //   },
    //   {
    //     test: /\.ts$/,
    //     presets: [
    //       '@babel/preset-typescript'
    //     ]
    //   }
    // ],
    env: {
      test: {
        presets: [
          [
            '@babel/preset-env',
            // {
            //   useBuiltIns: 'usage',
            //   corejs: 3.39
            // }
          ]
        ]
      },
      production: {
        plugins: [
          ['react-remove-properties', { 'properties': [ 'data-test-id' ] }]
        ]
      }
    }
  };

} 
