type StyleCalculatorParams = {
  containerWidth: number; // width available for the stick, in pixels
  totalLength: number; // length of the molecule represented by the stick, nucleotides
  viewportStart: number;
  viewportEnd: number;
  focusRegion: {
    start: number;
    end: number;
  } | null;
  centromere: {
    start: number;
    end: number;
  } | null;
};

export const styleCalculator = (params: StyleCalculatorParams) => {
  const transformationFactor = getTransformationFactor(
    params.containerWidth,
    params.totalLength
  );
  // const viewportStartPosition = params.
};

const getTransformationFactor = (width: number, nucleotidesCount: number) => {
  return Math.ceil(width / nucleotidesCount);
};
