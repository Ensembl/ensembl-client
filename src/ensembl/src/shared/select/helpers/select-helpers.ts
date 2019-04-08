import cloneDeep from 'lodash/cloneDeep';

import { Option, OptionGroup } from '../Select';

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
