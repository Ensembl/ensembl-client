import { toFasta, LINE_LENGTH } from './fastaFormatter';
import random from 'lodash/random';

const generateSequence = (length: number) => {
  const alphabet = 'AGCT';
  let sequence = '';
  for (let i = 0; i <= length; i++) {
    const characterIndex = Math.floor(Math.random() * alphabet.length);
    const character = alphabet[characterIndex];
    sequence += character;
  }
  return sequence;
};

describe('fasta formatter', () => {

  it('formats raw sequence in the fasta format', () => {
    const sequenceLength = random(1, 600);
    const sequenceLabel = 'label for the sequence';
    const rawSequence = generateSequence(sequenceLength);
    const fastaFormattedSequence = toFasta(sequenceLabel, rawSequence);

    const [firstLine, ...sequenceLines] = fastaFormattedSequence.split('\n');
    expect(firstLine).toBe(`>${sequenceLabel}`);
    expect(sequenceLines.every(line => line.length <= LINE_LENGTH));
    expect(sequenceLines.join('')).toBe(rawSequence);
  });

});
