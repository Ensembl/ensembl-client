export const getStepLengthInNucleotides = (start: number, end: number) => {
  start = start - 1;
  const intervalLength = end - start;

  let steps = [1, 2, 5];

  while (!steps.some((step) => intervalLength / step <= 10)) {
    steps = steps.map((step) => step * 10);
  }

  const { value: chosenStep } = steps.reduce(
    (result, step) => {
      if (result.continue && intervalLength / step <= 10) {
        return { value: step, continue: false };
      } else {
        return result;
      }
    },
    { value: steps[0], continue: true }
  );

  return chosenStep;
};

export const chooseTickForLabel = (
  steps: number[],
  start: number,
  end: number
) => {
  if (steps.length % 2) {
    // odd number of steps — return the middle one
    const indexOfMiddleStep = Math.floor(steps.length / 2) + 1;
    return { index: indexOfMiddleStep, value: steps[indexOfMiddleStep] };
  } else {
    // even number of steps — choose between two closest to the middle
    const candidateStepIndices = [steps.length / 2, steps.length / 2 + 1];
    const { index: winningIndex = 0 } =
      candidateStepIndices.reduce(
        (result: { index: number; distance: number } | null, index) => {
          const midpoint = (end - start) / 2; // FIXME: circular chromosomes
          const distanceFromMidpoint = Math.abs(steps[index] - midpoint);
          if (!result || distanceFromMidpoint < result.distance) {
            return { index, distance: distanceFromMidpoint };
          } else {
            return result;
          }
        },
        null
      ) || {};
    return { index: winningIndex, value: steps[winningIndex] };
  }
};
