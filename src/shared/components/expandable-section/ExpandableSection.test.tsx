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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import faker from '@faker-js/faker';

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
  ) => render(<ExpandableSection {...defaultProps} {...props} />);

  let container: any;

  beforeEach(() => {
    jest.resetAllMocks();
    container = renderExpandableSection().container;
  });

  it('renders without error', () => {
    expect(() => container).not.toThrow();
  });

  it('hides the expanded content when isExpanded is false', () => {
    container = renderExpandableSection({
      isExpanded: false
    }).container;
    expect(container.querySelectorAll('.expandedContent')).toHaveLength(0);
    expect(container.querySelectorAll('.collapsedContent')).toHaveLength(1);
  });

  it('shows the expanded content when isExpanded is true', () => {
    expect(container.querySelectorAll('.expandedContent')).toHaveLength(1);
    expect(container.querySelectorAll('.collapsedContent')).toHaveLength(0);
  });

  it('calls onToggle prop when collapsing or expanding', () => {
    userEvent.click(container.querySelector('.toggle'));
    expect(mockOnToggle).toBeCalledWith(false);

    container = renderExpandableSection({
      isExpanded: false
    }).container;

    userEvent.click(container.querySelector('.toggle'));
    expect(mockOnToggle).toBeCalledWith(true);
  });

  it('applies the passed in classNames', () => {
    expect(
      container
        .querySelector('.expandableSection')
        .classList.contains(defaultProps.classNames?.wrapper)
    ).toBeTruthy();

    expect(
      container
        .querySelector('.expandedContent')
        .classList.contains(defaultProps.classNames?.expanded)
    ).toBeTruthy();

    container = renderExpandableSection({
      isExpanded: false
    }).container;
    expect(
      container
        .querySelector('.collapsedContent')
        .classList.contains(defaultProps.classNames?.collapsed)
    ).toBeTruthy();
  });
});
