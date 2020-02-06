const webpackMerge = require('webpack-merge');

/* NOTE:
- env may or may not be passed
- env may or may not contain the presets field
- the presets field contains either a string or an array of strings
*/
const loadPresets = (env) => {
  let { presets = [] } = env;
  if (typeof presets === 'string') {
    presets = [presets];
  }

  return webpackMerge(presets.map(presetName =>
    require(`./webpack.${presetName}`)(env)
  ));
};

module.exports = loadPresets;
