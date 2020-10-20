/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getFullSpeciesItemWidth } from 'src/shared/components/selected-species/selectedSpeciesHelpers';

import { Props as SelectedSpeciesProps } from 'src/shared/components/selected-species/SelectedSpecies';

const SPACE_BETWEEN_SPECIES = 7;

export const getSpeciesItemWidths = ({
  items,
  containerWidth
}: {
  items: Array<SelectedSpeciesProps & { isHovered: boolean }>;
  containerWidth: number;
}) => {
  const naturalItemWidths = items.map((item) =>
    getFullSpeciesItemWidth(item.species)
  );
  const activeItemIndex = items.findIndex((item) => item.isActive);
  const hoveredItemIndex = items.findIndex((item) => item.isHovered);

  const totalWidth = naturalItemWidths.reduce((result, width, index) => {
    const margin = index < naturalItemWidths.length ? SPACE_BETWEEN_SPECIES : 0;
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
    const marginRight = index < widths.length - 1 ? SPACE_BETWEEN_SPECIES : 0;
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
        (largestNativeWidth && width <= largestNativeWidth)
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
    return (itemsNumber - 1) * SPACE_BETWEEN_SPECIES;
  }
};
