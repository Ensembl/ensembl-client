import React from 'react';
import { mount } from 'enzyme';

import CheckboxGrid, { CheckboxGridOption } from './CheckboxGrid';
import Checkbox from 'src/shared/checkbox/Checkbox';
import faker from 'faker';
import times from 'lodash/times';
import orderBy from 'lodash/orderBy';

const createCheckboxData = (options: any) => {
  const id = faker.lorem.word();
  const label = faker.lorem.word();
  const isChecked = faker.random.boolean();

  options.push({
    id,
    label,
    isChecked
  });
};

const createOptions = (): CheckboxGridOption[] => {
  const options: CheckboxGridOption[] = [];
  times(10, () => createCheckboxData(options));
  return options;
};

const defaultOptions: CheckboxGridOption[] = createOptions();

const onChange = jest.fn();

describe('<CheckboxGrid />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let wrapper: any;
  const defaultProps = {
    options: defaultOptions,
    onChange,
    label: faker.lorem.word()
  };

  it('renders without error', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);
    expect(wrapper.find(CheckboxGrid).length).toEqual(1);
  });

  it('renders N number of checkboxes based on the options', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);

    expect(wrapper.find(Checkbox).length).toEqual(defaultOptions.length);
  });

  it('sorts the checkboxes alphebatically based on the label', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);

    const firstGridContainer = wrapper.find('.checkboxGridContainer').first();

    const labels: string[] = [];
    Object.values(defaultOptions).forEach((element) => {
      labels.push(element.label);
    });
    labels.sort();

    const firstLabel = labels.shift();
    const lastLabel = labels.pop();
    const firstCheckbox = firstGridContainer.find(Checkbox).first();
    expect(firstCheckbox.prop('label')).toEqual(firstLabel);

    const lastCheckbox = firstGridContainer.find(Checkbox).last();
    expect(lastCheckbox.prop('label')).toEqual(lastLabel);
  });

  it('calls the checkboxOnChange when a checkbox is checked/unchecked', async () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);
    const firstCheckbox = wrapper.find(Checkbox).first();

    firstCheckbox.find('.defaultCheckbox').simulate('click');

    const checkedStatus = firstCheckbox.prop('checked');

    const orderedDefaultAttributes = orderBy(defaultOptions, ['label']);

    const firstCheckboxID = orderedDefaultAttributes[0].id;
    expect(onChange).toBeCalledWith(!checkedStatus, firstCheckboxID);
  });

  it('hides the unchecked checkboxes when hideUnchecked is true', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} hideUnchecked={true} />);

    let totalCheckedCheckboxes = 0;

    Object.values(defaultOptions).forEach((section) => {
      if (section.isChecked) {
        totalCheckedCheckboxes++;
      }
    });

    expect(wrapper.find(Checkbox).length).toBe(totalCheckedCheckboxes);
  });

  it('hides the title when hideTitles is true', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} hideLabel={true} />);

    expect(wrapper.find('.checkboxGridTitle').length).toBe(0);
  });

  it('draws 3 columns by default', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);
    const firstGridContainer = wrapper.find('.checkboxGridContainer').first();
    expect(firstGridContainer.children().length).toBe(3);
  });

  it('draws N number of columns based on the `column` parameter', () => {
    const columns = 4;

    wrapper = mount(<CheckboxGrid {...defaultProps} columns={columns} />);
    const firstGridContainer = wrapper.find('.checkboxGridContainer').first();
    expect(firstGridContainer.children().length).toBe(columns);
  });
});
