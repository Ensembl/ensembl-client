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
import { faker } from '@faker-js/faker';

import ExternalReference from './ExternalReference';

const link = faker.internet.url();

describe('<ExternalReference />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders a link with a label', () => {
    const labelText = 'I am label';
    const linkText = 'Hello world';
    const className = faker.lorem.word();

    const { container, getByText } = render(
      <ExternalReference label={labelText} to={link} className={className}>
        {linkText}
      </ExternalReference>
    );

    const labelElement = getByText(labelText);
    const linkElement = getByText(linkText);

    expect(labelElement).toBeTruthy();
    expect(linkElement.tagName).toBe('A');

    expect(
      (container.firstChild as HTMLElement).classList.contains(className)
    ).toBe(true);
  });

  it('renders a link without a label', () => {
    const linkText = 'Hello world';

    const { container, getByText } = render(
      <ExternalReference to={link}>{linkText}</ExternalReference>
    );

    const linkElement = getByText(linkText);

    expect(container.querySelector('.label')).toBeFalsy();
    expect(linkElement.tagName).toBe('A');
  });

  it('renders reference in a span if no link was provided', () => {
    const linkText = 'Hello world';

    const { getByText } = render(
      <ExternalReference>{linkText}</ExternalReference>
    );

    const linkElement = getByText(linkText);

    expect(linkElement.tagName).toBe('SPAN');
  });
});
