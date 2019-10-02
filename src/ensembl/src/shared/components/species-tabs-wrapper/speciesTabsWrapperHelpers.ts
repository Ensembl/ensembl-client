import { getFullSpeciesItemWidth } from 'src/shared/components/selected-species/selectedSpeciesHelpers';

import { Props as FocusableSelectedSpeciesProps } from 'src/shared/components/selected-species/FocusableSelectedSpecies';

const BETWEEN_SPECIES_SPACE = 7;

export const getSpeciesItemWidths = ({
  items,
  containerWidth
}: {
  items: Array<FocusableSelectedSpeciesProps & { isHovered: boolean }>;
  containerWidth: number;
}) => {
  const naturalItemWidths = items.map((item) =>
    getFullSpeciesItemWidth(item.species)
  );
  const activeItemIndex = items.findIndex((item) => item.isActive);
  const hoveredItemIndex = items.findIndex((item) => item.isHovered);

  const totalWidth = naturalItemWidths.reduce((result, width, index) => {
    const margin = index < naturalItemWidths.length ? BETWEEN_SPECIES_SPACE : 0;
    return result + width + margin;
  }, 0);

  if (totalWidth <= containerWidth) {
    return naturalItemWidths;
  } else {
    const fixedWidthIndices =
      hoveredItemIndex > -1
        ? [activeItemIndex, hoveredItemIndex]
        : [activeItemIndex];
    const largestNativeWidth = findLargestFittingNativeWidth({
      widths: naturalItemWidths,
      fixedWidthIndices,
      containerWidth
    });
    const truncatedWidth = getTruncatedWidth({
      widths: naturalItemWidths,
      largestNativeWidth,
      fixedWidthIndices,
      containerWidth
    });
    return naturalItemWidths.map((width, index) => {
      if (
        fixedWidthIndices.includes(index) ||
        (largestNativeWidth && width <= largestNativeWidth)
      ) {
        return width;
      } else {
        return truncatedWidth;
      }
    });
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
    const marginRight = index < widths.length - 1 ? BETWEEN_SPECIES_SPACE : 0;
    return total + addedWidth + marginRight;
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
  largestNativeWidth: number | null;
  fixedWidthIndices: number[];
  containerWidth: number;
}) => {
  const [unchangedWidths, widthsForTruncation] = widths.reduce(
    (result, width, index) => {
      let [unchangedWidths, widthsForTruncation] = result;
      if (
        fixedWidthIndices.includes(index) ||
        (largestNativeWidth && width < largestNativeWidth)
      ) {
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
  const remainingWidth =
    containerWidth - totalUnchangedWidth - getTotalSpaceBetween(widths.length);
  return Math.ceil(remainingWidth / widthsForTruncation.length);
};

const getTotalSpaceBetween = (itemsNumber: number) => {
  if (itemsNumber < 2) {
    return 0;
  } else {
    return (itemsNumber - 1) * BETWEEN_SPECIES_SPACE;
  }
};
