import { ScaleLinear } from 'd3';

export const getTicks = (scale: ScaleLinear<number, number>) => {
  // use d3 scale to get 'approximately' 10 ticks (exact number not guaranteed)
  // which are "human-readable" (i.e. are multiples of powers of 10)
  // and are guaranteed to fall within the scale's domain
  let ticks = scale.ticks();
  const length = scale.domain()[1]; // get back the initial length value on which the scale is based
  const step = ticks[1] - ticks[0];

  // choose only the "important" ticks for labelling
  const exponent = Math.floor(Math.log10(length));
  const powerOfTen = 10 ** exponent; // e.g. 100, 1000, 10000, etc.

  if (length >= powerOfTen && length < powerOfTen + step) {
    return handleLengthAsPowerOfTen(ticks, powerOfTen, step, length);
  }

  ticks = ticks.filter((number) => {
    // do not add a tick in the end of the ruler (it is handled specially)
    // and throw away all the possible 'inelegant' intermediate ticks, such as 50, etc.
    return number !== length && number % powerOfTen === 0;
  });

  let labelledTicks = getLabelledTicks(ticks, powerOfTen, length);

  if (!labelledTicks.length) {
    // let's have at least one label, roughly in the middle of the ruler
    const halvedPowerOfTen = powerOfTen / 2;
    ticks = [...ticks, halvedPowerOfTen].sort();
    labelledTicks = [halvedPowerOfTen];
  }

  return {
    ticks,
    labelledTicks
  };
};

const handleLengthAsPowerOfTen = (
  ticks: number[],
  powerOfTen: number,
  step: number,
  totalLength: number
) => {
  ticks = ticks.filter((number) => {
    if (number === powerOfTen) {
      return totalLength - number > step * 0.2; // show last tick if it's more that 20% of step length removed from end of ruler
    }
    return true;
  });
  return {
    ticks,
    labelledTicks: [powerOfTen / 2]
  };
};

const getLabelledTicks = (
  ticks: number[],
  powerOfTen: number,
  totalLength: number
) => {
  let filterForLabels = buildFilterForLabels(powerOfTen, totalLength);
  let labelledTicks = ticks.filter(filterForLabels);

  if (labelledTicks.length > 5) {
    // that's too many labels; let's use the half of the next power of ten for labelling
    const nextPowerOfTen = powerOfTen * 10;
    const halvedNextPowerOfTen = nextPowerOfTen / 2;
    filterForLabels = buildFilterForLabels(halvedNextPowerOfTen, totalLength);
    const newLabelledTicks = ticks.filter(filterForLabels);
    if (newLabelledTicks.length < 5) {
      labelledTicks = newLabelledTicks;
    }
  }

  return labelledTicks;
};

const buildFilterForLabels = (powerOfTen: number, totalLength: number) => (
  number: number,
  index: number,
  ticks: number[]
) => {
  const lastIndex = ticks.length - 1;

  if (number % powerOfTen !== 0) {
    return false;
  } else if (index !== lastIndex) {
    return true;
  } else {
    return totalLength - number > totalLength * 0.1;
  }
};
