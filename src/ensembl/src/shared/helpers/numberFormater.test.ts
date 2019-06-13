import { getCommaSeparatedNumber } from './numberFormatter';

describe('getCommaSeparatedNumber', () => {
  it('returns 1,234 for the input 1234', () => {
    expect(getCommaSeparatedNumber(1234)).toBe('1,234');
  });

  it('returns 12,345 for the input 12345', () => {
    expect(getCommaSeparatedNumber(12345)).toBe('12,345');
  });

  it('returns 123,456 for the input 123456', () => {
    expect(getCommaSeparatedNumber(123456)).toBe('123,456');
  });

  it('returns 1,234,567 for the input 1234567', () => {
    expect(getCommaSeparatedNumber(1234567)).toBe('1,234,567');
  });

  it('returns -1,234,567 for the input -1234567', () => {
    expect(getCommaSeparatedNumber(-1234567)).toBe('-1,234,567');
  });
});
