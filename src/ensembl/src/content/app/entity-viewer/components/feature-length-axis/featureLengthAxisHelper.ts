import { ScaleLinear } from 'd3';

export const getTicks = (scale: ScaleLinear<number, number>) => {
  // use d3 scale to get 'approximately' 10 ticks (exact number not guaranteed)
  // which are "human-readable" (i.e. are multiples of powers of 10)
  // and are guaranteed to fall within the scale's domain
  let ticks = scale.ticks();
  const length = scale.domain()[1]; // get back the initial length value on which the scale is based

  // choose only the "important" ticks for labelling
  const exponent = Number(
    (length.toExponential().match(/e\+(\d+)/) as string[])[1]
  );
  const base = 10 ** exponent; // e.g. 100, 1000, 10000, etc.
  ticks = ticks.filter((number) => {
    return (
      number !== length && number % base === 0 // do not add a tick in the end of the ruler; it is handled specially
    ); // throw away all the possible 'inelegant' intermediate ticks, such as 50, etc.
  });

  let labelledTicks = getLabelledTicks(ticks, base, length);

  if (labelledTicks.length > 5) {
    // that's too many labels; let's increase out base
    const incrementedBase = base * 10;
    const halfIncrementedBase = incrementedBase / 2;
    const newLabelledTicks = getLabelledTicks(
      ticks,
      halfIncrementedBase,
      length
    );
    if (newLabelledTicks.length > 0 && newLabelledTicks.length < 5) {
      labelledTicks = newLabelledTicks;
    }
  } else if (!labelledTicks.length) {
    // let's decrease out base
    const halfCurrentBase = base / 2;
    ticks = [...ticks, halfCurrentBase].sort();
    labelledTicks = [halfCurrentBase];
  }

  return {
    ticks,
    labelledTicks
  };
};

const getLabelledTicks = (
  ticks: number[],
  base: number,
  totalLength: number
) => {
  return ticks
    .filter((number) => number % base === 0)
    .filter((number, index, array) => {
      const lastIndex = array.length - 1;
      return (
        index !== lastIndex ||
        (index === lastIndex && totalLength - number > totalLength * 0.1)
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
