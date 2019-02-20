const path = require("path");

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    include: [
      path.resolve(__dirname, "../src"),
      path.resolve(__dirname, "../stories"),
    ]
  });
  defaultConfig.resolve.extensions.push(".ts", ".tsx");

  return defaultConfig;
};