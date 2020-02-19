const fs = require('fs');
const path = require('path');

const { addLicense, removeLicense, replaceLicense } = require('./license-manager');

const licenseText = fs.readFileSync(path.resolve(__dirname, 'license-header.txt'), 'utf-8').trim();

const mockFileContent = `
const foo = 1;
const bar = 2;

const add = (x, y) => x + y;

add(foo, bar);
`.trim();

const newLicenseText = `
Hello!

I am a new license.

Ain't I pretty?
`.trim();


const getLicenseComment = (licenseText) => `/*\n${licenseText}\n*/`;

describe('license-manager', () => {

  describe('addLicense', () => {
    it('adds license to the head of the file', () => {
      const expectedLicenseComment = getLicenseComment(licenseText);
      const expectedFileContent = `${expectedLicenseComment}\n\n${mockFileContent}`;
      expect(addLicense(mockFileContent, licenseText)).toBe(expectedFileContent);
    });

    it('does not modify file already containing license', () => {
      const licenseComment = getLicenseComment(licenseText);
      const fileContent = `${licenseComment}\n\n${mockFileContent}`;
      expect(addLicense(fileContent, licenseText)).toBe(fileContent);
    });
  });

  describe('removeLicense', () => {
    it('removes license from the head of the file', () => {
      const licenseComment = getLicenseComment(licenseText);
      const fileWithLicense = `${licenseComment}\n\n${mockFileContent}`;
      expect(removeLicense(fileWithLicense, licenseText)).toBe(mockFileContent);
    });
  });

  describe('replaceLicense', () => {
    it('replaces old license with the new one', () => {
      const oldLicenseComment = getLicenseComment(licenseText);
      const newLicenseComment = getLicenseComment(newLicenseText);
      const fileWithOldComment = `${oldLicenseComment}\n\n${mockFileContent}`;
      const expectedFileContent = `${newLicenseComment}\n\n${mockFileContent}`;
      expect(replaceLicense(fileWithOldComment, licenseText, newLicenseText)).toBe(expectedFileContent);
    });
  });
});
