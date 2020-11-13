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
import { mount } from 'enzyme';
import faker from 'faker';

import ExternalLink, { ExternalLinkProps } from './ExternalLink';

const defaultProps: ExternalLinkProps = {
  linkText: faker.random.words(),
  to: faker.internet.url(),
  classNames: {
    icon: faker.random.words(),
    link: faker.random.words()
  }
};

describe('<ExternalLink />', () => {
  const renderExternalLink = (props: Partial<ExternalLinkProps> = {}) =>
    mount(<ExternalLink {...defaultProps} {...props} />);

  let wrapper: any;

  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = renderExternalLink();
  });

  it('renders without error', () => {
    expect(() => wrapper).not.toThrow();
  });

  it('applies the passed in classNames', () => {
    expect(
      wrapper.find('.icon').hasClass(defaultProps.classNames?.icon)
    ).toBeTruthy();
    expect(
      wrapper.find('.link').hasClass(defaultProps.classNames?.link)
    ).toBeTruthy();
  });
});
