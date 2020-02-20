const fs = require('fs');
const path = require('path');

const { addLicence, removeLicence, replaceLicence } = require('./licence-manager');

const licenceText = fs.readFileSync(path.resolve(__dirname, 'licence-header.txt'), 'utf-8').trim();

const mockFileContent = `
const foo = 1;
const bar = 2;

const add = (x, y) => x + y;

add(foo, bar);
`.trim();

const newLicenceText = `
Hello!

I am a new licence.

Ain't I pretty?
`.trim();


const getLicenceComment = (licenceText) => `/*\n${licenceText}\n*/`;

describe('licence-manager', () => {

  describe('addLicence', () => {
    it('adds licence to the head of the file', () => {
      const expectedLicenceComment = getLicenceComment(licenceText);
      const expectedFileContent = `${expectedLicenceComment}\n\n${mockFileContent}`;
      expect(addLicence(mockFileContent, licenceText)).toBe(expectedFileContent);
    });

    it('does not modify file already containing licence', () => {
      const licenceComment = getLicenceComment(licenceText);
      const fileContent = `${licenceComment}\n\n${mockFileContent}`;
      expect(addLicence(fileContent, licenceText)).toBe(fileContent);
    });
  });

  describe('removeLicence', () => {
    it('removes licence from the head of the file', () => {
      const licenceComment = getLicenceComment(licenceText);
      const fileWithLicence = `${licenceComment}\n\n${mockFileContent}`;
      expect(removeLicence(fileWithLicence, licenceText)).toBe(mockFileContent);
    });
  });

  describe('replaceLicence', () => {
    it('replaces old licence with the new one', () => {
      const oldLicenceComment = getLicenceComment(licenceText);
      const newLicenceComment = getLicenceComment(newLicenceText);
      const fileWithOldComment = `${oldLicenceComment}\n\n${mockFileContent}`;
      const expectedFileContent = `${newLicenceComment}\n\n${mockFileContent}`;
      expect(replaceLicence(fileWithOldComment, licenceText, newLicenceText)).toBe(expectedFileContent);
    });
  });
});
