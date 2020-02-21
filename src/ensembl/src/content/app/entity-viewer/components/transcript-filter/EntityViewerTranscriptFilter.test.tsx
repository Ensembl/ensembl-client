import React from 'react';
import { mount } from 'enzyme';
import times from 'lodash/times';
import faker from 'faker';

import EntityViewerTranscriptFilter from './EntityViewerTranscriptFilter';
import Checkbox from 'src/shared/components/checkbox/Checkbox';

let totalOptions = 0;

const createOption = () => {
  totalOptions++;
  const randomValueAndLabel = faker.random.uuid();

  return {
    value: randomValueAndLabel,
    label: randomValueAndLabel
  };
};

const createOptionGroup = (number = 5) => {
  return times(number, () => createOption());
};

const onChange = jest.fn();

const optionGroups = times(5, () => createOptionGroup());

const getRandomSelectedValues = () => {
  const randomSelectedValues: string[] = [];

  optionGroups.forEach((options) =>
    randomSelectedValues.push(
      options[Math.floor(Math.random() * options.length)].value
    )
  );

  return randomSelectedValues;
};

const selectedValues = getRandomSelectedValues();

const defaultProps = {
  optionsGroup: optionGroups,
  selectedValues: selectedValues,
  onChange
};

const renderTranscriptFilter = (props?: any) => {
  return mount(<EntityViewerTranscriptFilter {...defaultProps} {...props} />);
};

describe('<EntityViewerTranscriptFilter />', () => {
  let wrapper: any = renderTranscriptFilter();

  beforeEach(() => {
    wrapper = renderTranscriptFilter();
  });

  it('displays N number of Checkbox based on the number of options', () => {
    expect(wrapper.find(Checkbox).length).toBe(totalOptions);
  });

  it('displays N number of option groups based on the number of option groups', () => {
    expect(wrapper.find('.optionGroup').length).toBe(optionGroups.length);
  });

  it('calls the onChange when a Checkbox is changed', () => {
    wrapper
      .find(Checkbox)
      .at(Math.floor(Math.random() * totalOptions))
      .find('input')
      .simulate('change');
    expect(onChange).toBeCalled();
  });

  it('checks a checkbox by default if its value is present in selectedValues', () => {
    expect(wrapper.find('input[checked=true]').length).toBe(
      selectedValues.length
    );
  });

  it('adds the checkbox value to selectedValues when it is checked', () => {
    const firstUncheckedCheckbox = wrapper.find('input[checked=false]').first();

    // Since value and label are same in our case
    const firstUncheckedCheckboxValue = [
      firstUncheckedCheckbox.closest(Checkbox).props().label
    ];

    firstUncheckedCheckbox.simulate('change');

    expect(onChange).toBeCalledWith(
      expect.arrayContaining(firstUncheckedCheckboxValue)
    );
  });

  it('removes the checkbox value from selectedValues when it is unchecked', () => {
    const firstCheckedCheckbox = wrapper.find('input[checked=true]').first();

    // Since value and label are same in our case
    const firstCheckedCheckboxValue = [
      firstCheckedCheckbox.closest(Checkbox).props().label
    ];
    firstCheckedCheckbox.simulate('change');

    expect(onChange).toBeCalledWith(
      expect.not.arrayContaining(firstCheckedCheckboxValue)
    );
  });

  it('does not display any unchecked checkbox when hideUnchecked is true', () => {
    wrapper = renderTranscriptFilter({ hideUnchecked: true });

    expect(wrapper.find('input[checked=false]').length).toBeFalsy();
  });

  it('does not apply optionGroup className when hideUnchecked is true', () => {
    expect(wrapper.find('.optionGroup').length).toBeTruthy();

    wrapper = renderTranscriptFilter({ hideUnchecked: true });

    expect(wrapper.find('.optionGroup').length).toBeFalsy();
  });
});
