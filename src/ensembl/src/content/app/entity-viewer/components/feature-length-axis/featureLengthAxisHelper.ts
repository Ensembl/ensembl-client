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
  const powerOfTen = 10 ** exponent; // e.g. 100, 1000, 10000, etc.
  ticks = ticks.filter((number) => {
    // do not add a tick in the end of the ruler (it is handled specially)
    // and throw away all the possible 'inelegant' intermediate ticks, such as 50, etc.
    return number !== length && number % powerOfTen === 0;
  });

  let labelledTicks = getLabelledTicks(ticks, powerOfTen, length);

  if (labelledTicks.length > 5) {
    // that's too many labels; let's increase out base
    const nextPowerOfTen = powerOfTen * 10;
    const halvedPowerOfTen = nextPowerOfTen / 2;
    const newLabelledTicks = getLabelledTicks(ticks, halvedPowerOfTen, length);
    if (newLabelledTicks.length > 0 && newLabelledTicks.length < 5) {
      labelledTicks = newLabelledTicks;
    }
  } else if (!labelledTicks.length) {
    // let's decrease out base
    const halvedPowerOfTen = powerOfTen / 2;
    ticks = [...ticks, halvedPowerOfTen].sort();
    labelledTicks = [halvedPowerOfTen];
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
