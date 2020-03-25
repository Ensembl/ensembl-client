import {
  Slice,
  SliceWithLocationOnly
} from 'src/content/app/entity-viewer/types/slice';

export const getFeatureCoordinates = (feature: {
  slice: SliceWithLocationOnly;
}) => {
  const { start, end } = feature.slice.location;
  return { start, end };
};

export const getFeatureStrand = (feature: { slice: Slice }) =>
  feature.slice.region.strand;

export const getFeatureLength = (feature: { slice: Slice }) => {
  const { start, end } = getFeatureCoordinates(feature);
  const { code: strandCode } = getFeatureStrand(feature);
  return strandCode === 'forward' ? end - start + 1 : start - end + 1;
};
