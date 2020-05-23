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

import React from 'react';
import { mount } from 'enzyme';
import CheckboxWithSelects from './CheckboxWithSelects';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import Select from 'src/shared/components/select/Select';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import faker from 'faker';
import times from 'lodash/times';

const createOption = (isSelected = false) => ({
  value: faker.random.uuid(),
  label: faker.random.words(5),
  isSelected
});

const onChange = jest.fn();

describe('<CheckboxWithSelects />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let wrapper: any;
  const defaultProps = {
    onChange: onChange,
    label: 'foo',
    selectedOptions: [],
    options: times(5, () => createOption())
  };

  it('renders without error', () => {
    wrapper = mount(<CheckboxWithSelects {...defaultProps} />);
    expect(wrapper.find(CheckboxWithSelects).length).toEqual(1);
  });

  it('does not check the checkbox when there are no options selected', () => {
    wrapper = mount(<CheckboxWithSelects {...defaultProps} />);

    expect(wrapper.find(Checkbox).prop('checked')).toBe(false);
  });

  it('displays one Select when the checkbox is unchecked', () => {
    wrapper = mount(<CheckboxWithSelects {...defaultProps} />);

    expect(wrapper.find(Checkbox).prop('checked')).toBe(false);
    expect(wrapper.find(Select).length).toBe(1);
  });

  it('displays one Select when the checkbox is checked', () => {
    wrapper = mount(<CheckboxWithSelects {...defaultProps} />);

    wrapper.find(Checkbox).find('.defaultCheckbox').simulate('click');
    expect(wrapper.find(Select).length).toBe(1);
  });

  it('automatically checks the checkbox if at least one option is selected', () => {
    wrapper = mount(
      <CheckboxWithSelects {...defaultProps} selectedOptions={['one']} />
    );

    expect(wrapper.find(Checkbox).prop('checked')).toBe(true);
  });

  it('does not display the remove button next to the Select if no option is selected ', () => {
    wrapper = mount(<CheckboxWithSelects {...defaultProps} />);

    wrapper.find(Checkbox).find('.defaultCheckbox').simulate('click');
    expect(wrapper.find(Select).length).toBe(1);
    expect(wrapper.find('.removeIconHolder').length).toBe(0);
  });

  it('displays the remove button next to the Select if an option is selected', () => {
    wrapper = mount(
      <CheckboxWithSelects
        {...defaultProps}
        selectedOptions={[defaultProps.options[0].value]}
      />
    );

    expect(wrapper.find('.removeIconHolder').length).toBe(1);
  });

  it('displays the Plus button when one option is selected', () => {
    wrapper = mount(
      <CheckboxWithSelects
        {...defaultProps}
        selectedOptions={[defaultProps.options[0].value]}
      />
    );

    expect(wrapper.find('.addIconHolder').length).toBe(1);
  });

  it('displays another select when the plus button is clicked', () => {
    wrapper = mount(
      <CheckboxWithSelects
        {...defaultProps}
        selectedOptions={[defaultProps.options[0].value]}
      />
    );

    expect(wrapper.find(Select)).toHaveLength(1);

    wrapper.find('.addIconHolder').find(ImageButton).simulate('click');

    expect(wrapper.find(Select)).toHaveLength(2);
  });

  it('hides the options that are already selected within the new Select', () => {
    wrapper = mount(
      <CheckboxWithSelects
        {...defaultProps}
        selectedOptions={[defaultProps.options[0].value]}
      />
    );

    wrapper.find('.addIconHolder').find(ImageButton).simulate('click');
    expect(wrapper.find(Select).last().prop('options')).toHaveLength(4);
  });

  it('does not display the Plus button when all the options are selected', () => {
    const optionValues: any = [];
    defaultProps.options.forEach((option) => {
      optionValues.push(option.value);
    });

    wrapper = mount(
      <CheckboxWithSelects {...defaultProps} selectedOptions={optionValues} />
    );

    expect(wrapper.find('.addIconHolder').length).toBe(0);
  });

  it('calls the onChange function when an option is selected', () => {
    wrapper = mount(
      <CheckboxWithSelects
        {...defaultProps}
        selectedOptions={[defaultProps.options[0].value]}
      />
    );

    wrapper.find('.addIconHolder').find(ImageButton).simulate('click');

    wrapper.find(Select).last().find('.selectControl').simulate('click');
    wrapper.update();
    wrapper.find('.optionsPanel').last().find('li').first().simulate('click');

    expect(onChange).toHaveBeenCalledWith([
      defaultProps.options[0].value,
      defaultProps.options[1].value
    ]);
  });

  it('calls the onChange function when an option is removed', () => {
    const selectedOptions = [
      defaultProps.options[0].value,
      defaultProps.options[1].value
    ];
    wrapper = mount(
      <CheckboxWithSelects
        {...defaultProps}
        selectedOptions={selectedOptions}
      />
    );
    wrapper
      .find('.removeIconHolder')
      .last()
      .find(ImageButton)
      .simulate('click');

    expect(onChange).toHaveBeenCalledWith([defaultProps.options[0].value]);
  });
});
