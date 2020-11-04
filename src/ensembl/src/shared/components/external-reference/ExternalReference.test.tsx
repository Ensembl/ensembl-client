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

import ExternalReference, { ExternalReferenceProps } from './ExternalReference';
import ExternalLink from '../external-link/ExternalLink';

const defaultProps: ExternalReferenceProps = {
  label: faker.random.words(),
  linkText: faker.random.words(),
  to: faker.internet.url(),
  classNames: {
    container: faker.random.words(),
    label: faker.random.words(),
    icon: faker.random.words(),
    link: faker.random.words()
  }
};

describe('<ExternalReference />', () => {
  const renderExternalReference = (
    props: Partial<ExternalReferenceProps> = {}
  ) => mount(<ExternalReference {...defaultProps} {...props} />);

  let wrapper: any;

  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = renderExternalReference();
  });

  it('renders without error', () => {
    expect(() => wrapper).not.toThrow();
  });

  it('hides label container div when there is no label', () => {
    wrapper = renderExternalReference({ label: undefined });
    expect(wrapper.find('.label')).toHaveLength(0);
  });

  it('applies the passed in classNames', () => {
    expect(
      wrapper.render().hasClass(defaultProps.classNames?.container)
    ).toBeTruthy();
    expect(
      wrapper.find('.label').hasClass(defaultProps.classNames?.label)
    ).toBeTruthy();
    expect(wrapper.find(ExternalLink).prop('classNames')).toEqual({
      icon: defaultProps.classNames?.icon,
      link: defaultProps.classNames?.link
    });
  });
});
