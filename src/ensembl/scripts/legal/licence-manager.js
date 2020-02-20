const addLicence = (fileContent, licenceText) => {
  if (!shouldAddLicence(fileContent, licenceText)) {
    return fileContent;
  }
  const licenceComment = prepareLicenceComment(licenceText);
  return `${licenceComment}\n\n${fileContent}`;
};

const removeLicence = (fileContent, licenceText) => {
  const licenceComment = prepareLicenceComment(licenceText);
  const fileWithoutLicence = fileContent.replace(licenceComment, '');
  return fileWithoutLicence.replace(/^\s+/, ''); // remove leading white space
};

const replaceLicence = (fileContent, oldLicence, newLicence) => {
  const cleanFileContent = removeLicence(fileContent, oldLicence);
  return addLicence(cleanFileContent, newLicence);
};

const prepareLicenceComment = (licenceText) => {
  licenceText = licenceText.trim();
  const start = '/*';
  const end = '*/';
  return [start, licenceText, end].join('\n');
};

const shouldAddLicence = (fileContent, licenceText) => {
  return !fileContent.includes(licenceText.trim());
};

module.exports = {
  addLicence,
  removeLicence,
  replaceLicence
};
