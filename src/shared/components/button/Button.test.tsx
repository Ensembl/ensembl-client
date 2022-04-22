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

import { PrimaryButton, SecondaryButton } from './Button';

const onClick = jest.fn();

const defaultProps = {
  onClick
};

describe('PrimaryButton', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders a button', () => {
    const { container } = render(
      <PrimaryButton {...defaultProps}>I am primary button</PrimaryButton>
    );
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('assigns the primaryButton class to the button', () => {
    const { container } = render(
      <PrimaryButton {...defaultProps}>I am primary button</PrimaryButton>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains('primaryButton')).toBe(true);
  });

  it('extends button’s own class with external classname', () => {
    const externalClass = faker.lorem.word();
    const { container } = render(
      <PrimaryButton {...defaultProps} className={externalClass}>
        I am primary button
      </PrimaryButton>
    );
    const button = container.querySelector('button');

    expect(button?.classList.contains('primaryButton')).toBe(true);
    expect(button?.classList.contains(externalClass)).toBe(true);
  });

  it('renders children', () => {
    const buttonText = faker.lorem.words();
    const { container } = render(
      <PrimaryButton {...defaultProps}>{buttonText}</PrimaryButton>
    );
    const button = container.querySelector('button');
    expect(button?.textContent).toBe(buttonText);
  });

  it('calls onClick when clicked', async () => {
    const { container } = render(
      <PrimaryButton {...defaultProps}>I am primary button</PrimaryButton>
    );
    const button = container.querySelector('button') as HTMLButtonElement;

    await userEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it('does not call onClick if disabled', async () => {
    const { container } = render(
      <PrimaryButton {...defaultProps} isDisabled={true}>
        I am primary button
      </PrimaryButton>
    );
    const button = container.querySelector('button') as HTMLButtonElement;

    await userEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('SecondaryButton', () => {
  // same as primary, but has a different class

  it('assigns the secondaryButton class to the button', () => {
    const { container } = render(
      <SecondaryButton {...defaultProps}>I am secondary button</SecondaryButton>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains('secondaryButton')).toBe(true);
  });

  it('extends own class with external classname', () => {
    const externalClass = faker.lorem.word();
    const { container } = render(
      <SecondaryButton {...defaultProps} className={externalClass}>
        I am secondary button
      </SecondaryButton>
    );
    const button = container.querySelector('button');

    expect(button?.classList.contains('secondaryButton')).toBe(true);
    expect(button?.classList.contains(externalClass)).toBe(true);
  });
});
