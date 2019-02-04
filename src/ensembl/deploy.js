const execSync = require('child_process').execSync;
const machine = process.argv[2] || 'amaster';

execSync(
  `rsync -avz -e 'ssh' ./dist ${machine}:/homes/ens_adm02/ensembl-2020/`,
  { stdio: [0, 1, 2] }
);
