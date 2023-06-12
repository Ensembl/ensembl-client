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

import ExternalReference, { ExternalReferenceProps } from './ExternalReference';

const defaultProps: ExternalReferenceProps = {
  label: faker.lorem.word(),
  linkText: faker.lorem.word(),
  to: faker.internet.url(),
  classNames: {
    container: faker.lorem.word(),
    label: faker.lorem.word(),
    icon: faker.lorem.word(),
    link: faker.lorem.word()
  }
};

describe('<ExternalReference />', () => {
  const renderExternalReference = (
    props: Partial<ExternalReferenceProps> = {}
  ) => render(<ExternalReference {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without error', () => {
    const { container } = renderExternalReference();
    expect(() => container).not.toThrow();
  });

  it('hides label container div when there is no label', () => {
    const { container } = renderExternalReference({ label: undefined });

    expect(container.querySelector('.label')).toBeFalsy();
  });

  it('applies the passed in classNames', () => {
    const { container } = renderExternalReference();

    expect(
      container.querySelector(`.${defaultProps.classNames?.container}`)
    ).toBeTruthy();

    expect(
      container
        .querySelector('.label')
        ?.classList.contains(defaultProps.classNames?.label as string)
    ).toBeTruthy();

    expect(
      container
        .querySelector(`.externalLinkContainer svg`)
        ?.classList.contains(defaultProps.classNames?.icon as string)
    ).toBeTruthy();

    expect(
      container.querySelector(
        `.externalLinkContainer .${defaultProps.classNames?.link}`
      )
    ).toBeTruthy();
  });

  it('does not display ExternalLink component when there is no link', () => {
    const { container } = renderExternalReference({ to: undefined });

    expect(container.querySelector(`.externalLinkContainer`)).toBeFalsy();

    expect(container.querySelector(`.noLink`)).toBeTruthy();

    expect(container.querySelector(`.noLink`)?.textContent).toBe(
      defaultProps.linkText
    );
  });
});
