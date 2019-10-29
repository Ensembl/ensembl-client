module.exports = {
  policy: [{ userAgent: '*', disallow: '/' }],
  host: ( (!process.env.DEPLOYENV || process.env.DEPLOYENV === 'prod') ? '' : process.env.DEPLOYENV + '-') + '2020.ensembl.org'
};
