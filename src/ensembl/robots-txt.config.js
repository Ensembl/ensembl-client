module.exports = {
  policy: [{ userAgent: '*', disallow: '/' }],
  host: process.env.DEPLOYENV === 'prod' ? '2020.ensembl.org' : process.env.DEPLOYENV + '-2020.ensembl.org'
};
