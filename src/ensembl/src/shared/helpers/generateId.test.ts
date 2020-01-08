import { generateId, resetNextId } from './generateId';

describe('generateId helper', () => {
  describe('generateId', () => {
    it('generates incremental uuids', () => {
      expect(generateId()).toBe(0);
      expect(generateId()).toBe(1);
    });
  });

  describe('resetNextId', () => {
    it('resets the uuid', () => {
      resetNextId();
      expect(generateId()).toBe(0);
      resetNextId();
      expect(generateId()).toBe(0);
    });
  });
});
