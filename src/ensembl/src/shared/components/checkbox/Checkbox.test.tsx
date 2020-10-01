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
import Checkbox from './Checkbox';
import faker from 'faker';

const onChange = jest.fn();

describe('<Checkbox />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without error', () => {
    expect(() => {
      mount(<Checkbox checked={false} onChange={onChange} />);
    }).not.toThrow();
  });

  it('does not display any label by default', () => {
    const wrapper = mount(<Checkbox checked={false} onChange={onChange} />);
    expect(wrapper.find('label')).toHaveLength(0);
  });

  it('displays the label if it is passed as a prop', () => {
    const label = faker.lorem.words();
    const wrapper = mount(
      <Checkbox checked={false} onChange={onChange} label={label} />
    );

    expect(wrapper.find('label').text()).toBe(label);
  });

  it('applies default classes', () => {
    const label = faker.lorem.words();
    const wrapper = mount(
      <Checkbox checked={false} onChange={onChange} label={label} />
    );
    expect(wrapper.find('.checkboxHolder')).toHaveLength(1);
    expect(wrapper.find('.defaultCheckbox')).toHaveLength(1);
    expect(wrapper.find('.defaultLabel')).toHaveLength(1);
  });

  it('correctly applies classes when checkbox is selected or disabled', () => {
    const wrapper = mount(
      <Checkbox checked={false} onChange={onChange} disabled={true} />
    );
    let checkbox = wrapper.find('.defaultCheckbox');
    expect(checkbox.hasClass('unchecked')).toBe(true);
    expect(checkbox.hasClass('disabled')).toBe(true);

    wrapper.setProps({ checked: true, disabled: false });
    checkbox = wrapper.find('.defaultCheckbox');
    expect(checkbox.hasClass('checked')).toBe(true);
    expect(checkbox.hasClass('unchecked')).toBe(false);
    expect(checkbox.hasClass('disabled')).toBe(false);
  });

  it('correctly applies classes passed from the parent', () => {
    const classesFromParent = {
      checkboxHolder: faker.random.uuid(),
      checked: faker.random.uuid(),
      unchecked: faker.random.uuid(),
      disabled: faker.random.uuid()
    };
    const label = faker.lorem.words();
    const labelClassFromParent = faker.lorem.word();

    const wrapper = mount(
      <Checkbox
        checked={false}
        onChange={onChange}
        classNames={classesFromParent}
        disabled={true}
        label={label}
        labelClassName={labelClassFromParent}
      />
    );
    const topLevelElement = wrapper.find('.checkboxHolder');
    let checkbox = wrapper.find('.defaultCheckbox');
    const labelElement = wrapper.find('label');

    expect(topLevelElement.hasClass(classesFromParent.checkboxHolder)).toBe(
      true
    );
    expect(labelElement.hasClass(labelClassFromParent)).toBe(true);
    expect(checkbox.hasClass(classesFromParent.unchecked)).toBe(true);
    expect(checkbox.hasClass(classesFromParent.disabled)).toBe(true);

    wrapper.setProps({ checked: true, disabled: false });
    checkbox = wrapper.find('.defaultCheckbox');
    expect(checkbox.hasClass(classesFromParent.checked)).toBe(true);
    expect(checkbox.hasClass(classesFromParent.unchecked)).toBe(false);
    expect(checkbox.hasClass(classesFromParent.disabled)).toBe(false);
  });

  describe('behaviour on change', () => {
    it('calls the onChange prop when clicked', () => {
      const wrapper = mount(<Checkbox checked={false} onChange={onChange} />);

      wrapper.find('.defaultCheckbox').simulate('click');
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not call the onChange prop when disabled', () => {
      const wrapper = mount(
        <Checkbox checked={false} onChange={onChange} disabled={true} />
      );

      wrapper.find('.defaultCheckbox').simulate('click');

      expect(onChange).not.toHaveBeenCalled();
    });

    it('calls the onChange function if the label is clicked', () => {
      const label = faker.lorem.words();
      const wrapper = mount(
        <Checkbox checked={false} label={label} onChange={onChange} />
      );

      wrapper.find('.defaultLabel').simulate('click');

      expect(onChange).toHaveBeenCalled();
    });
  });
});
