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

import ExternalLink, { ExternalLinkProps } from './ExternalLink';

const defaultProps: ExternalLinkProps = {
  linkText: faker.random.words(),
  to: faker.internet.url(),
  classNames: {
    icon: faker.lorem.word(),
    link: faker.lorem.word()
  }
};

describe('<ExternalLink />', () => {
  const renderExternalLink = () => render(<ExternalLink {...defaultProps} />);
  it('renders without error', () => {
    const { container } = renderExternalLink();
    expect(() => container).not.toThrow();
  });

  it('applies the passed in classNames', () => {
    const { container } = renderExternalLink();

    expect(
      container
        .querySelector(`svg`)
        ?.classList.contains(defaultProps.classNames?.icon as string)
    ).toBeTruthy();

    expect(
      container.querySelector(`.link.${defaultProps.classNames?.link}`)
    ).toBeTruthy();
  });
});
