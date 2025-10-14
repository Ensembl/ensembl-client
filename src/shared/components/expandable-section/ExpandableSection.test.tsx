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

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { faker } from '@faker-js/faker';

import ExpandableSection, { ExpandableSectionProps } from './ExpandableSection';

const expandedContent = faker.lorem.paragraph();
const collapsedContent = faker.lorem.paragraph();
const mockOnToggle = vi.fn();

const defaultProps = {
  expandedContent,
  collapsedContent,
  isExpanded: true,
  onToggle: mockOnToggle,
  classNames: {
    wrapper: faker.lorem.slug(),
    expanded: faker.lorem.slug(),
    collapsed: faker.lorem.slug()
  }
} satisfies ExpandableSectionProps;

beforeEach(() => {
  vi.resetAllMocks();
});

describe('<ExpandableSection />', () => {
  it('hides the expanded content when isExpanded is false', () => {
    const { container } = render(
      <ExpandableSection {...defaultProps} isExpanded={false} />
    );
    expect(container.textContent).toBe(collapsedContent);
  });

  it('shows the expanded content when isExpanded is true', () => {
    // isExpanded property is true in defaultProps above
    const { container } = render(<ExpandableSection {...defaultProps} />);
    expect(container.textContent).toBe(expandedContent);
  });

  it('calls onToggle prop when collapsing or expanding', async () => {
    const { container, rerender } = render(
      <ExpandableSection {...defaultProps} />
    );
    await userEvent.click(container.querySelector('.toggle') as HTMLElement);
    expect(mockOnToggle).toHaveBeenCalledWith(false);

    rerender(<ExpandableSection {...defaultProps} isExpanded={false} />);

    await userEvent.click(container.querySelector('.toggle') as HTMLElement);
    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });

  it('applies the passed in classNames', () => {
    const { container, rerender } = render(
      <ExpandableSection {...defaultProps} />
    );
    expect(
      container
        .querySelector('.expandableSection')
        ?.classList.contains(defaultProps.classNames.wrapper)
    ).toBeTruthy();

    expect(
      container
        .querySelector('.expandedContent')
        ?.classList.contains(defaultProps.classNames?.expanded)
    ).toBeTruthy();

    rerender(<ExpandableSection {...defaultProps} isExpanded={false} />);

    expect(
      container.querySelector(`.${defaultProps.classNames.collapsed}`)
    ).toBeTruthy();
  });
});
