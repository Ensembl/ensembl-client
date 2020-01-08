const path = require('path');

const getPaths = (env) => {
  const isDev = ['dev', 'development'].includes(env);

  const rootPath = path.resolve(__dirname, '../');
  const nodeModulesPath = path.resolve(rootPath, 'node_modules');
  const staticPath = path.resolve(rootPath, 'static');
  const buildPath = path.resolve(rootPath, 'dist');

  return {
    rootPath,
    nodeModulesPath,
    buildPath,
    staticPath,
    buildStaticPath: path.resolve(buildPath, 'static'),
    htmlFileName: isDev ? 'index.html' : '../index.html',
    htmlTemplatePath: path.resolve(staticPath, 'html/template.html'),
    envTemplatePath: path.resolve(rootPath, '.env.example'),
  };
};

module.exports = {
  getPaths
};
