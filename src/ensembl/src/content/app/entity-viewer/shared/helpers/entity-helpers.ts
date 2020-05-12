import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import {
  Slice,
  SliceWithLocationOnly
} from 'src/content/app/entity-viewer/types/slice';
import { Transcript } from '../../types/transcript';

export const getFeatureCoordinates = (feature: {
  slice: SliceWithLocationOnly;
}) => {
  const { start, end } = feature.slice.location;
  return { start, end };
};

export const getRegionName = (feature: { slice: Slice }) =>
  feature.slice.region.name;

export const getFeatureStrand = (feature: { slice: Slice }) =>
  feature.slice.region.strand.code;

// FIXME: remove this when we can get the length from the API
export const getFeatureLength = (feature: { slice: Slice }) => {
  const { start, end } = getFeatureCoordinates(feature);
  const strandCode = getFeatureStrand(feature);
  return strandCode === 'forward' ? end - start + 1 : start - end + 1;
};


export const getFirstAndLastCodingExonIndexes = (transcript: Transcript) => {
  const { exons, cds } = transcript;
  let firstCodingExonIndex = 0;
  let lastCodingExonIndex = exons.length - 1;

  if (cds) {
    firstCodingExonIndex = exons.findIndex((exon) => {
      const { start: exonStart, end: exonEnd } = getFeatureCoordinates(exon);
      return exonStart <= cds.start && exonEnd >= cds.start;
    });

    lastCodingExonIndex = exons.findIndex((exon) => {
      const { start: exonStart, end: exonEnd } = getFeatureCoordinates(exon);
      return exonStart <= cds.end && exonEnd >= cds.end;
    });
  }

  return {
    firstCodingExonIndex,
    lastCodingExonIndex
  };
};

export const getNumberOfCodingExons = (transcript: Transcript) => {
  const {
    firstCodingExonIndex,
    lastCodingExonIndex
  } = getFirstAndLastCodingExonIndexes(transcript);
  return getCommaSeparatedNumber(
    lastCodingExonIndex - firstCodingExonIndex + 1
  );
};
