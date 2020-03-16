import { getStrandDisplayName } from './strandFormatter';
import { Strand } from 'src/content/app/entity-viewer/types/strand';

describe('getStrandDisplayName', () => {
  it('returns the correct strand display name', () => {
    expect(getStrandDisplayName(Strand.FORWARD)).toBe('forward strand');
    expect(getStrandDisplayName(Strand.REFVERSE)).toBe('reverse strand');
  });
});
