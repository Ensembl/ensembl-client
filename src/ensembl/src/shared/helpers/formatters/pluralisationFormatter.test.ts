import { pluralise } from './pluralisationFormatter';

describe('pluralise', () => {
  it('does not pluralise when count is 1', () => {
    expect(pluralise('gene', 1)).toBe('gene');
  });

  it('pluralises when count more than 1', () => {
    expect(pluralise('transcript', 2)).toBe('transcripts');
  });

  it('pluralises irregular nouns as expected', () => {
    expect(pluralise('species', 2)).toBe('species');
  });
});
