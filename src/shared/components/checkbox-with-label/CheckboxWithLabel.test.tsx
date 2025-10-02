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

import CheckboxWithLabel from './CheckboxWithLabel';

const onChange = vi.fn();

describe('<CheckboxWithLabel />', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const label = faker.lorem.words();

  it('applies theme classes', () => {
    const props = {
      checked: false,
      onChange,
      label
    };
    const { container, rerender } = render(<CheckboxWithLabel {...props} />);

    const component = container.firstChild as HTMLElement;

    // light theme is used by default, and does not add any extra classes
    expect(component.classList.contains('themeLighter')).toBe(false);
    expect(component.classList.contains('themeDark')).toBe(false);

    rerender(<CheckboxWithLabel {...props} theme="lighter" />);

    expect(component.classList.contains('themeLighter')).toBe(true);
    expect(component.classList.contains('themeDark')).toBe(false);

    rerender(<CheckboxWithLabel {...props} theme="dark" />);

    expect(component.classList.contains('themeLighter')).toBe(false);
    expect(component.classList.contains('themeDark')).toBe(true);
  });

  describe('behaviour on change', () => {
    it('calls the onChange prop when clicked', async () => {
      const { container } = render(
        <CheckboxWithLabel checked={false} onChange={onChange} label={label} />
      );
      const checkbox = container.querySelector('input') as HTMLElement;

      await userEvent.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not call the onChange prop when disabled', async () => {
      const { container } = render(
        <CheckboxWithLabel
          label={label}
          checked={false}
          onChange={onChange}
          disabled={true}
        />
      );
      const checkbox = container.querySelector('input') as HTMLElement;

      await userEvent.click(checkbox);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('calls the onChange function if the label is clicked', async () => {
      const { container } = render(
        <CheckboxWithLabel checked={false} onChange={onChange} label={label} />
      );
      const renderedLabel = container.querySelector('label') as HTMLElement;

      await userEvent.click(renderedLabel);

      expect(onChange).toHaveBeenCalled();
    });
  });
});
