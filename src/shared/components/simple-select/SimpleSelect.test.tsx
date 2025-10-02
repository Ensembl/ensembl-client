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

import { useRef, useEffect, useState, type ChangeEvent } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SimpleSelect, { type SimpleSelectMethods } from './SimpleSelect';

const options = [
  {
    value: '1',
    label: 'One'
  },
  {
    value: '2',
    label: 'Two'
  },
  {
    value: '3',
    label: 'Three'
  }
];

describe('SimpleSelect', () => {
  it('renders a list of options', () => {
    const { container } = render(
      <SimpleSelect options={options} className={'classFromParent'} />
    );
    const simpleSelectElement = container.firstElementChild as HTMLElement;

    // SimpleSelect renders a div element (for styling purposes)
    expect(simpleSelectElement.tagName.toLowerCase()).toBe('div');
    expect(simpleSelectElement.classList.contains('select')).toBe(true);
    expect(simpleSelectElement.classList.contains('classFromParent')).toBe(
      true
    );

    // The div returned by SimpleSelect contains a native select element
    expect(simpleSelectElement.querySelector('select')).toBeTruthy();

    // The component renders html option elements for the options prop that it receives
    expect(simpleSelectElement.querySelectorAll('option')?.length).toBe(
      options.length
    );
  });

  it('has the first option selected by default', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <SimpleSelect options={options} onChange={onChange} />
    );

    const selectElement = container.querySelector(
      'select'
    ) as HTMLSelectElement;

    expect(selectElement.value).toBe(options[0].value);

    const secondOption = selectElement.querySelector(
      'option:nth-child(2)'
    ) as HTMLOptionElement;

    await userEvent.selectOptions(selectElement, secondOption);

    expect(onChange.mock.calls[0][0].target.value).toBe('2');
  });

  it('selects correct option based on value property', async () => {
    const TestComponent = () => {
      const [selectValue, setSelectValue] = useState(options[1].value);

      const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectValue(event.target.value);
      };

      return (
        <SimpleSelect
          options={options}
          value={selectValue}
          onChange={onChange}
        />
      );
    };

    const { container } = render(<TestComponent />);

    const selectElement = container.querySelector(
      'select'
    ) as HTMLSelectElement;

    // check if default value is selected
    expect(selectElement.value).toBe(options[1].value);

    const firstOption = selectElement.querySelector(
      'option'
    ) as HTMLOptionElement;

    await userEvent.selectOptions(selectElement, firstOption);

    expect(selectElement.value).toBe(options[0].value);
  });

  it('renders an empty placeholder option', () => {
    const placeholderText = 'I am placeholder!';
    const { container } = render(
      <SimpleSelect options={options} placeholder={placeholderText} />
    );
    const optionElements = container.querySelectorAll('option');
    const placeholderOption = optionElements[0];

    expect(placeholderOption.textContent).toBe(placeholderText);
    expect(placeholderOption.getAttribute('value')).toBe('');
    expect(placeholderOption.hasAttribute('disabled')).toBe(true);
  });

  it('exposes a method for resetting the select', async () => {
    let selectComponentRef = { clear: vi.fn() };

    // prepare a wrapper component for testing
    const TestComponent = () => {
      const simpleSelectRef = useRef<SimpleSelectMethods | null>(null);

      useEffect(() => {
        selectComponentRef =
          simpleSelectRef.current as typeof selectComponentRef;
      });

      return <SimpleSelect ref={simpleSelectRef} options={options} />;
    };
    const { container } = render(<TestComponent />);

    const selectElement = container.querySelector(
      'select'
    ) as HTMLSelectElement;

    // select the last option
    await userEvent.selectOptions(
      selectElement,
      options.at(-1)?.value as string
    );

    // check that the last option is, in fact, selected
    expect(selectElement.selectedIndex).toBe(options.length - 1);

    selectComponentRef.clear();
    expect(selectElement.selectedIndex).toBe(-1); // selected index of -1 means that no option is selected
  });
});
