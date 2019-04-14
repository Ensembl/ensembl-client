import cloneDeep from 'lodash/cloneDeep';

import { Option, OptionGroup, GroupedOptionIndex } from '../Select';

export const findSelectedIndexForOptions = (options: Option[]) => {
  return options.findIndex(({ isSelected }) => isSelected);
};

export const findSelectedIndexForOptionGroups = (
  optionGroups: OptionGroup[]
) => {
  for (let groupIndex = 0; groupIndex < optionGroups.length; groupIndex++) {
    const group = optionGroups[groupIndex];
    for (
      let optionIndex = 0;
      optionIndex < group.options.length;
      optionIndex++
    ) {
      const option = group.options[optionIndex];
      if (option.isSelected) {
        return [groupIndex, optionIndex];
      }
    }
  }

  return -1;
};

export const splitFromSelected = (
  optionGroups: OptionGroup[]
): [Option, OptionGroup[]] | [null, OptionGroup[]] => {
  const position = findSelectedIndexForOptionGroups(optionGroups);

  if (!Array.isArray(position)) {
    // no option selected; return unmodified option groups
    return [null, optionGroups];
  }

  const [groupIndex, optionIndex] = position;
  const selectedOption = optionGroups[groupIndex].options[optionIndex];
  const withoutSelected = cloneDeep(optionGroups);
  withoutSelected[groupIndex].options.splice(optionIndex, 1);
  return [selectedOption, withoutSelected];
};

export const getNextItemIndex = (
  currentIndex: GroupedOptionIndex | null,
  optionGroups: OptionGroup[]
): GroupedOptionIndex | null => {
  const [groupIndex, itemIndex] = currentIndex || [null, null];
  const currentGroup =
    typeof groupIndex === 'number' ? optionGroups[groupIndex] : null;
  const firstItemIndex: GroupedOptionIndex = [0, 0];

  if (currentIndex === null) {
    return firstItemIndex;
  } else if (
    currentGroup &&
    typeof itemIndex === 'number' &&
    itemIndex < currentGroup.options.length - 1
  ) {
    // move to the next item in the group
    return [groupIndex, itemIndex + 1] as GroupedOptionIndex;
  } else if (groupIndex === optionGroups.length - 1) {
    // this is the last item in the last group;
    // cycle back to the first item in the list
    return firstItemIndex;
  } else if (typeof groupIndex === 'number') {
    // move to the next group in the list
    return [groupIndex + 1, 0];
  } else {
    return null; // should never happen, but makes Typescript happy
  }
};

export const getPreviousItemIndex = (
  currentIndex: GroupedOptionIndex | null,
  optionGroups: OptionGroup[]
): GroupedOptionIndex | null => {
  const [groupIndex, itemIndex] = currentIndex || [null, null];
  const lastGroupIndex = optionGroups.length - 1;
  const lastGroupItemIndex = optionGroups[lastGroupIndex].options.length - 1;
  const lastItemIndex: GroupedOptionIndex = [
    lastGroupIndex,
    lastGroupItemIndex
  ];

  if (currentIndex === null) {
    return lastItemIndex;
  } else if (typeof itemIndex === 'number' && itemIndex > 0) {
    // move to the previous item
    return [groupIndex, itemIndex - 1] as GroupedOptionIndex;
  } else if (groupIndex === 0) {
    // this is the first item in the first group;
    // cycle back to the last item in the last group
    return lastItemIndex;
  } else if (typeof groupIndex === 'number') {
    // move to the last item in the previous group
    const previousGroupIndex = groupIndex - 1;
    const lastItemIndex = optionGroups[previousGroupIndex].options.length - 1;
    return [previousGroupIndex, lastItemIndex];
  } else {
    return null; // should never happen, but makes Typescript happy
  }
};

export const setOptionsPanelHeight = (
  elementRef: React.MutableRefObject<HTMLDivElement | null>
) => {
  const panel = elementRef.current;
  if (!panel) {
    return;
  }

  const windowHeight = window.innerHeight;
  const { top: panelTop, height: panelHeight } = panel.getBoundingClientRect();

  if (panelTop + panelHeight > windowHeight) {
    const bottomOffset = 10;
    panel.style.height = `${windowHeight - panelTop - bottomOffset}px`;
  }
};

export const getPanelScrollStatus = (panel: HTMLDivElement) => {
  console.log(
    'panel.scrollTop',
    panel.scrollTop,
    'panel.scrollHeight',
    panel.scrollHeight,
    'panel.clientHeight',
    panel.clientHeight,
    panel.scrollTop === panel.scrollHeight - panel.clientHeight
  );
  return {
    isScrolledToTop: panel.scrollTop === 0,
    isScrolledToBottom:
      panel.scrollTop === panel.scrollHeight - panel.clientHeight
  };
};
