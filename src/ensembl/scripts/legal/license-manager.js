const addLicense = (fileContent, licenseText) => {
  if (!shouldAddLicense(fileContent, licenseText)) {
    return fileContent;
  }
  const licenseComment = prepareLicenseComment(licenseText);
  return `${licenseComment}\n\n${fileContent}`;
};

const removeLicense = (fileContent, licenseText) => {
  const licenseComment = prepareLicenseComment(licenseText);
  const fileWithoutLicense = fileContent.replace(licenseComment, '');
  return fileWithoutLicense.replace(/^\s+/, ''); // remove leading white space
};

const replaceLicense = (fileContent, oldLicense, newLicense) => {
  const cleanFileContent = removeLicense(fileContent, oldLicense);
  return addLicense(cleanFileContent, newLicense);
};

const prepareLicenseComment = (licenseText) => {
  licenseText = licenseText.trim();
  const start = '/*';
  const end = '*/';
  return [start, licenseText, end].join('\n');
};

const shouldAddLicense = (fileContent, licenseText) => {
  return !fileContent.includes(licenseText.trim());
};

module.exports = {
  addLicense,
  removeLicense,
  replaceLicense
};
