import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import { Props as FocusableSelectedSpeciesProps } from './FocusableSelectedSpecies';

const SPECIES_NAME_SIZE = 14;
const ASSEMBLY_NAME_SIZE = 11;
const PADDING_SIZE = 20;
const SPACE_BETWEEN = 7;
const BORDER_WIDTH = 1;

export const getDisplayName = (species: CommittedItem) =>
  species.common_name || species.scientific_name;

export const getSpeciesItemWidths = ({
  items,
  containerWidth
}: {
  items: FocusableSelectedSpeciesProps[];
  containerWidth: number;
}) => {
  const naturalItemWidths = items.map((item) =>
    getFullSpeciesItemWidth(item.species)
  );
  const activeItemIndex = items.findIndex((item) => item.isActive);

  const totalWidth = naturalItemWidths.reduce(
    (result, width) => result + width,
    0
  );

  if (totalWidth <= containerWidth) {
    return naturalItemWidths;
  } else {
    const fixedWidthIndices = [activeItemIndex]; // FIXME to include hover?
    const largestNativeWidth = findLargestFittingNativeWidth({
      widths: naturalItemWidths,
      fixedWidthIndices,
      containerWidth
    });
    if (!largestNativeWidth) {
      // panic! return something meaningful, but this should not happen
      return naturalItemWidths;
    } else {
      const truncatedWidth = getTruncatedWidth({
        widths: naturalItemWidths,
        largestNativeWidth,
        fixedWidthIndices,
        containerWidth
      });
      return naturalItemWidths.map((width, index) => {
        if (fixedWidthIndices.includes(index) || width <= largestNativeWidth) {
          return width;
        } else {
          return truncatedWidth;
        }
      });
    }
  }
};

const findLargestFittingNativeWidth = ({
  widths,
  fixedWidthIndices,
  containerWidth
}: {
  widths: number[];
  fixedWidthIndices: number[];
  containerWidth: number;
}) => {
  // find the widest available items such that if there were no items wider than it,
  // then they would all fit in the container
  let largestWidth = 0;
  widths.forEach((currentWidth, index) => {
    if (
      !fixedWidthIndices.includes(index) &&
      canBeLargestWidth({
        widths,
        largestWidth: currentWidth,
        fixedWidthIndices,
        containerWidth
      })
    ) {
      if (currentWidth > largestWidth) {
        largestWidth = currentWidth;
      }
    }
  });
  return largestWidth || null;
};

const canBeLargestWidth = ({
  widths,
  fixedWidthIndices,
  largestWidth,
  containerWidth
}: {
  widths: number[];
  fixedWidthIndices: number[];
  largestWidth: number;
  containerWidth: number;
}) => {
  // find whether all items will fit in the container,
  // provided that they can be smaller but not larger than the largest width
  const estimatedTotalWidth = widths.reduce((total, width, index) => {
    const addedWidth =
      fixedWidthIndices.includes(index) || width < largestWidth
        ? width
        : largestWidth;
    return total + addedWidth;
  }, 0);
  return estimatedTotalWidth <= containerWidth;
};

const getTruncatedWidth = ({
  widths,
  largestNativeWidth,
  fixedWidthIndices,
  containerWidth
}: {
  widths: number[];
  largestNativeWidth: number;
  fixedWidthIndices: number[];
  containerWidth: number;
}) => {
  // FIXME account for margins between items
  const [unchangedWidths, widthsForTruncation] = widths.reduce(
    (result, width, index) => {
      let [unchangedWidths, widthsForTruncation] = result;
      if (fixedWidthIndices.includes(index) || width < largestNativeWidth) {
        unchangedWidths = [...unchangedWidths, width];
      } else {
        widthsForTruncation = [...widthsForTruncation, width];
      }
      return [unchangedWidths, widthsForTruncation];
    },
    [[], []] as Array<number[]>
  );
  const totalUnchangedWidth = unchangedWidths.reduce(
    (total, width) => total + width,
    0
  );
  const remainingWidth = containerWidth - totalUnchangedWidth;
  return remainingWidth / widthsForTruncation.length;
};

const getFullSpeciesItemWidth = (species: CommittedItem) => {
  const name = getDisplayName(species);
  const { assembly_name } = species;

  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvasContext.font = `700 ${SPECIES_NAME_SIZE}px Lato`;
  const speciesNameWidth = Math.ceil(canvasContext.measureText(name).width);

  canvasContext.font = `${ASSEMBLY_NAME_SIZE}px Lato`;
  const assemblyNameWidth = Math.ceil(
    canvasContext.measureText(assembly_name).width
  );

  const fullWidth =
    PADDING_SIZE * 2 +
    speciesNameWidth +
    SPACE_BETWEEN +
    assemblyNameWidth +
    2 * BORDER_WIDTH;
  return fullWidth;
};
