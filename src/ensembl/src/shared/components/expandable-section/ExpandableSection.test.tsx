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
import faker from 'faker';

import ExpandableSection, { ExpandableSectionProps } from './ExpandableSection';

const expandedContent = faker.lorem.paragraph();
const collapsedContent = faker.lorem.paragraph();
const mockOnToggle = jest.fn();

const defaultProps: ExpandableSectionProps = {
  expandedContent,
  collapsedContent,
  isExpanded: true,
  onToggle: mockOnToggle,
  classNames: {
    wrapper: faker.lorem.slug(),
    expanded: faker.lorem.slug(),
    collapsed: faker.lorem.slug()
  }
};

describe('<ExpandableSection />', () => {
  const renderExpandableSection = (
    props: Partial<ExpandableSectionProps> = {}
  ) => mount(<ExpandableSection {...defaultProps} {...props} />);

  let wrapper: any;

  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = renderExpandableSection();
  });

  it('renders without error', () => {
    expect(() => wrapper).not.toThrow();
  });

  it('hides the expanded content when isExpanded is false', () => {
    wrapper = renderExpandableSection({
      isExpanded: false
    });
    expect(wrapper.find('.expandedContent')).toHaveLength(0);
    expect(wrapper.find('.collapsedContent')).toHaveLength(1);
  });

  it('shows the expanded content when isExpanded is true', () => {
    expect(wrapper.find('.expandedContent')).toHaveLength(1);
    expect(wrapper.find('.collapsedContent')).toHaveLength(0);
  });

  it('calls onToggle prop when collapsing or expanding', () => {
    wrapper.find('.toggle').simulate('click');
    expect(mockOnToggle).toBeCalledWith(false);

    wrapper = renderExpandableSection({
      isExpanded: false
    });

    wrapper.find('.toggle').simulate('click');
    expect(mockOnToggle).toBeCalledWith(true);
  });

  it('applies the passed in classNames', () => {
    expect(
      wrapper
        .find('.expandableSection')
        .hasClass(defaultProps.classNames?.wrapper)
    ).toBeTruthy();

    expect(
      wrapper
        .find('.expandedContent')
        .hasClass(defaultProps.classNames?.expanded)
    ).toBeTruthy();

    wrapper = renderExpandableSection({
      isExpanded: false
    });
    expect(
      wrapper
        .find('.collapsedContent')
        .hasClass(defaultProps.classNames?.collapsed)
    ).toBeTruthy();
  });
});
