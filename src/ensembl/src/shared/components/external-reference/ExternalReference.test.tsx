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
import { render, screen } from '@testing-library/react';
import faker from 'faker';

import ExternalReference, { ExternalReferenceProps } from './ExternalReference';

const defaultProps: ExternalReferenceProps = {
  label: faker.random.word(),
  linkText: faker.random.word(),
  to: faker.internet.url(),
  classNames: {
    container: faker.random.word(),
    label: faker.random.word(),
    icon: faker.random.word(),
    link: faker.random.word()
  }
};

describe('<ExternalReference />', () => {
  const renderExternalReference = (
    props: Partial<ExternalReferenceProps> = {}
  ) => render(<ExternalReference {...defaultProps} {...props} />);

  let container: any;

  beforeEach(() => {
    jest.resetAllMocks();
    container = renderExternalReference().container;
  });

  it('renders without error', () => {
    expect(() => container).not.toThrow();
  });

  it('hides label container div when there is no label', () => {
    container = renderExternalReference({ label: undefined }).container;
    expect(container.querySelectorAll('.label')).toHaveLength(0);
  });

  it('applies the passed in classNames', () => {
    expect(
      screen
        .getByTestId('external reference container')
        .classList.contains(defaultProps.classNames?.container as string)
    ).toBeTruthy();

    expect(
      container
        .querySelector('.label')
        .classList.contains(defaultProps.classNames?.label)
    ).toBeTruthy();

    const externalLink = screen.getByTestId('external link container');
    expect(
      externalLink
        .getElementsByTagName('icon-mock')[0]
        .getAttribute('classname')
    ).toMatch(defaultProps.classNames?.icon as string);
    expect(
      externalLink
        .getElementsByTagName('a')[0]
        .classList.contains(defaultProps.classNames?.link as string)
    ).toBeTruthy();
  });
});
