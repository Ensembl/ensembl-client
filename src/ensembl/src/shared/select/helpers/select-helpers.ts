import { Option, OptionGroup } from '../Select';

export const findSelectedIndexForOptions = (options: Option[]) => {
  return options.findIndex(({ isSelected }) => isSelected);
};

export const findSelectedIndexForOptionGroups = (
  optionGroups: OptionGroup[]
) => {
  for (let groupIndex = 0; groupIndex < optionGroups.length - 1; groupIndex++) {
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
