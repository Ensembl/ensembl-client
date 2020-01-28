import { ScaleLinear } from 'd3';

export const getTicks = (scale: ScaleLinear<number, number>) => {
  // use d3 scale to get 'approximately' 10 ticks (exact number not guaranteed)
  // which are "human-readable" (i.e. are multiples of powers of 10)
  // and are guaranteed to fall within the scale's domain
  const ticks = scale.ticks();

  // choose only "important" ticks for labelling
  const lastTick = ticks[ticks.length - 1];
  const exponent = Number(
    (lastTick.toExponential().match(/e\+(\d+)/) as string[])[1]
  );
  const base = 10 ** exponent;

  let labelledTicks = getLabelledTicks(ticks, base, scale);

  if (labelledTicks.length > 5) {
    // e.g. for 900,000, d3 may offer 9 ticks [100000, 200000, 300000, etc]
    // that's too much for us; we will want a single 500000 tick
    const incrementedBase = base * 10;
    const halfIncrementedBase = incrementedBase / 2;
    labelledTicks = getLabelledTicks(ticks, halfIncrementedBase, scale);
  }

  return {
    ticks,
    labelledTicks
  };
};

const getLabelledTicks = (
  ticks: number[],
  base: number,
  scale: ScaleLinear<number, number>
) => {
  const maxDomainValue = scale.domain()[1];
  return ticks
    .filter((number) => number % base === 0)
    .filter((number, index, array) => {
      const lastIndex = array.length - 1;
      return (
        index !== lastIndex ||
        (index === lastIndex && maxDomainValue - number > maxDomainValue * 0.1)
      );
    });
};

// export const getStepLengthInNucleotides = (start: number, end: number) => {
//   start = start - 1;
//   const intervalLength = end - start;

//   let steps = [1, 2, 5];

//   while (!steps.some((step) => intervalLength / step <= 10)) {
//     steps = steps.map((step) => step * 10);
//   }

//   const { value: chosenStep } = steps.reduce(
//     (result, step) => {
//       if (result.continue && intervalLength / step <= 10) {
//         return { value: step, continue: false };
//       } else {
//         return result;
//       }
//     },
//     { value: steps[0], continue: true }
//   );

//   return chosenStep;
// };

// export const chooseTickForLabel = (
//   steps: number[],
//   start: number,
//   end: number
// ) => {
//   if (steps.length % 2) {
//     // odd number of steps — return the middle one
//     const indexOfMiddleStep = Math.floor(steps.length / 2) + 1;
//     return { index: indexOfMiddleStep, value: steps[indexOfMiddleStep] };
//   } else {
//     // even number of steps — choose between two closest to the middle
//     const candidateStepIndices = [steps.length / 2, steps.length / 2 + 1];
//     const { index: winningIndex = 0 } =
//       candidateStepIndices.reduce(
//         (result: { index: number; distance: number } | null, index) => {
//           const midpoint = (end - start) / 2; // FIXME: circular chromosomes
//           const distanceFromMidpoint = Math.abs(steps[index] - midpoint);
//           if (!result || distanceFromMidpoint < result.distance) {
//             return { index, distance: distanceFromMidpoint };
//           } else {
//             return result;
//           }
//         },
//         null
//       ) || {};
//     return { index: winningIndex, value: steps[winningIndex] };
//   }
// };
