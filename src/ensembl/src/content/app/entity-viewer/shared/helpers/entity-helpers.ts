import { SliceWithLocationOnly } from 'src/content/app/entity-viewer/types/slice';

export const getFeatureCoordinates = (feature: {
  slice: SliceWithLocationOnly;
}) => {
  const { start, end } = feature.slice.location;
  return { start, end };
};
