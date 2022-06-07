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
import { faker } from '@faker-js/faker';

import BadgedButton, { Props as BadgedButtonProps } from './BadgedButton';
import Button from '../button/Button';

const onClick = jest.fn();

const defaultProps = {
  badgeContent: faker.lorem.words()
};

const renderButton = (props: Partial<BadgedButtonProps> = {}) =>
  render(
    <BadgedButton {...defaultProps} {...props}>
      <Button onClick={onClick}>{faker.lorem.words()}</Button>
    </BadgedButton>
  );

describe('BadgedButton', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders the passed in button', () => {
    const { container } = renderButton();
    expect(container.querySelectorAll('.button')).toHaveLength(1);
  });

  it('assigns the "badgeDefault" class to the badge by default', () => {
    const { container } = renderButton();
    expect(container.querySelectorAll('.badgeDefault')).toHaveLength(1);
  });

  it('extends the badge class', () => {
    const fakeClassName = faker.lorem.word();
    const { container } = renderButton({ className: fakeClassName });
    expect(
      container
        .querySelector('.badgeDefault')
        ?.classList.contains(fakeClassName)
    ).toBeTruthy();
  });

  it('trims the longer strings to three characters', () => {
    const { container } = renderButton({ badgeContent: 'abcd' });
    expect(container.querySelector('.badgeDefault')?.textContent).toEqual(
      'abc'
    );
  });

  it('formats number greater than 99 to "99+"', () => {
    const { container } = renderButton({ badgeContent: 100 });
    expect(container.querySelector('.badgeDefault')?.textContent).toEqual(
      '99+'
    );
  });
});
