import React from 'react';
import { mount } from 'enzyme';
import CheckboxGrid from './CheckboxGrid';
import Checkbox from 'src/shared/checkbox/Checkbox';
import faker from 'faker';
import times from 'lodash/times';
import orderBy from 'lodash/orderBy';

import AttributesSection from 'src/content/app/custom-download/types/Attributes';

const createCheckboxData = (gridSection: any) => {
  const id = faker.lorem.word();
  const label = faker.lorem.word();
  const isChecked = faker.random.boolean();

  gridSection[id] = {
    id,
    label,
    isChecked
  };
};

const createGridData = (): AttributesSection => {
  const gridData: any = {
    default: {},
    External: {}
  };
  times(10, () => createCheckboxData(gridData['default']));

  times(10, () => createCheckboxData(gridData['External']));

  return gridData;
};

const gridData: AttributesSection = createGridData();

const checkboxOnChange = jest.fn();

describe('<CheckboxGrid />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let wrapper: any;
  const defaultProps = {
    gridData,
    checkboxOnChange
  };

  it('renders without error', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);
    expect(wrapper.find(CheckboxGrid).length).toEqual(1);
  });

  it('renders N number of checkboxes based on the gridData', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);

    let totalCheckboxes = 0;

    Object.values(gridData).forEach((section) => {
      totalCheckboxes += Object.keys(section).length;
    });

    expect(wrapper.find(Checkbox).length).toEqual(totalCheckboxes);
  });

  it('sorts the checkboxes alphebatically based on the label', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);

    const firstGridContainer = wrapper.find('.checkboxGridContainer').first();

    const labels: string[] = [];
    Object.values(gridData.default).forEach((element) => {
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

    const orderedDefaultAttributes = orderBy(gridData.default, ['label']);

    const firstCheckboxID = orderedDefaultAttributes[0].id;
    expect(checkboxOnChange).toBeCalledWith(
      !checkedStatus,
      'default',
      firstCheckboxID
    );
  });

  it('does not display the `Default` title if the sub-section is `default`', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);
    const firstGridTitle = wrapper.find('.checkboxGridTitle').first();
    expect(firstGridTitle.text()).not.toBe('Default');
  });

  it('hides the unchecked checkboxes when hideUnchecked is true', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} hideUnchecked={true} />);

    let totalCheckedCheckboxes = 0;

    Object.values(gridData).forEach((section) => {
      Object.values(section).forEach((subSection) => {
        if (subSection.isChecked) {
          totalCheckedCheckboxes++;
        }
      });
    });

    expect(wrapper.find(Checkbox).length).toBe(totalCheckedCheckboxes);
  });

  it('hides the title when hideTitles is true', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} hideTitles={true} />);

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
