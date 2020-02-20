const fs = require('fs');
const path = require('path');

const licenceManager = require('./licence-manager');

const licenceText = fs.readFileSync(path.resolve(__dirname, 'licence-header.txt'), 'utf-8');

const addLicence = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const withLicence = licenceManager.addLicence(fileContent, licenceText);
  fs.writeFileSync(filePath, withLicence);
};

const filePaths = process.argv.slice(2);
filePaths.forEach(addLicence);
