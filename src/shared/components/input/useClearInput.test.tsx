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

import { useRef, type ReactNode } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import noop from 'lodash/noop';

import useClearInput from './useClearInput';

const ClearIndicator = () => <div data-test-id="clear" />;

const TestComponent = (props: {
  value?: string;
  inputType?: string;
  help?: ReactNode;
  minLength?: number;
}) => {
  const ref = useRef(null);
  const { canClearInput } = useClearInput({
    ref,
    inputType: props.inputType ?? 'text',
    help: props.help,
    minLength: props.minLength
  });

  return (
    <>
      <input ref={ref} value={props.value} onChange={noop} />
      {canClearInput && <ClearIndicator />}
    </>
  );
};

describe('useClearInput', () => {
  it('detects input value passed via props', () => {
    const { queryByTestId } = render(
      <TestComponent inputType="search" value="foo" />
    );

    const clearIndicator = queryByTestId('clear');
    expect(clearIndicator).toBeTruthy();
  });

  it('detects input value from user input', async () => {
    const { container, queryByTestId } = render(
      <TestComponent inputType="search" />
    );

    const input = container.querySelector('input') as HTMLInputElement;

    let clearIndicator = queryByTestId('clear');
    expect(clearIndicator).toBeFalsy();

    await userEvent.type(input, 'hi');

    clearIndicator = queryByTestId('clear');
    expect(clearIndicator).toBeTruthy();
  });

  it('takes precedence over help', async () => {
    const help = 'Help text';

    const { container, queryByTestId } = render(
      <TestComponent inputType="search" help={help} />
    );
    const input = container.querySelector('input') as HTMLInputElement;

    await userEvent.type(input, 'hi');

    const clearIndicator = queryByTestId('clear');
    expect(clearIndicator).toBeTruthy();
  });

  it('does not take precedence over help if input shorter than min length', async () => {
    const help = 'Help text';

    const { container, queryByTestId } = render(
      <TestComponent inputType="search" help={help} minLength={3} />
    );
    const input = container.querySelector('input') as HTMLInputElement;

    await userEvent.type(input, 'fo');

    let clearIndicator = queryByTestId('clear');
    expect(clearIndicator).toBeFalsy();

    await userEvent.type(input, 'o');

    clearIndicator = queryByTestId('clear');
    expect(clearIndicator).toBeTruthy();
  });
});
