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

import RoundButton, { RoundButtonStatus } from './RoundButton';

const onClick = jest.fn();

const defaultProps = {
  onClick
};

describe('RoundButton', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders a button', () => {
    const { container } = render(
      <RoundButton {...defaultProps}>I am round button</RoundButton>
    );
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('assigns the "default" class to the button', () => {
    const { container } = render(
      <RoundButton {...defaultProps}>I am round button</RoundButton>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains('default')).toBe(true);
  });

  it('applies additional classes depending on the status', () => {
    const { container } = render(
      <RoundButton {...defaultProps} status={RoundButtonStatus.ACTIVE}>
        I am round button
      </RoundButton>
    );
    const button = container.querySelector('button');

    expect(button?.classList.contains('default')).toBe(true);
    expect(button?.classList.contains('active')).toBe(true);
  });

  it('contains passed children', () => {
    const buttonText = faker.lorem.words();
    const { container } = render(
      <RoundButton {...defaultProps}>{buttonText}</RoundButton>
    );
    const button = container.querySelector('button');

    expect(button?.textContent).toBe(buttonText);
  });

  it('calls onClick when clicked', async () => {
    const { container } = render(
      <RoundButton {...defaultProps}>I am round button</RoundButton>
    );
    const button = container.querySelector('button') as HTMLElement;

    await userEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it('does not call onClick if disabled', async () => {
    const { container } = render(
      <RoundButton {...defaultProps} status={RoundButtonStatus.DISABLED}>
        I am round button
      </RoundButton>
    );
    const button = container.querySelector('button') as HTMLElement;

    await userEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });
});
