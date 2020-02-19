const fs = require('fs');
const path = require('path');

const licenseManager = require('./license-manager');

const licenseText = fs.readFileSync(path.resolve(__dirname, 'license-header.txt'), 'utf-8');

const addLicense = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const withLicense = licenseManager.addLicense(fileContent, licenseText);
  fs.writeFileSync(filePath, withLicense);
};

const filePaths = process.argv.slice(2);
filePaths.forEach(addLicense);
