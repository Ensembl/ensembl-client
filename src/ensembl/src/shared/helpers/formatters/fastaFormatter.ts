export const LINE_LENGTH = 60; // line length in Ensembl refget implementations

export const toFasta = (sequenceLabel: string, sequence: string) => {
  const formattedSequence = [];
  formattedSequence.push(`>${sequenceLabel}`);

  let row = '';

  for (let i = 0; i < sequence.length; i++) {
    row += sequence[i];

    const isAtEndOfLine = (i + 1) % LINE_LENGTH === 0;
    if (i === sequence.length - 1 || isAtEndOfLine) {
      formattedSequence.push(row);
      row = '';
    }
  }

  return formattedSequence.join('\n');
};
