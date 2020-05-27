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
import BadgedButton from './BadgedButton';
import Button from '../button/Button';

const onClick = jest.fn();

const defaultProps = {
  badgeContent: faker.lorem.words()
};

const renderButton = (
  ButtonComponent: React.FunctionComponent<any>,
  props: any = defaultProps
) => mount(<ButtonComponent {...props} />);

describe('BadgedButton', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderButton(BadgedButton, {
      ...defaultProps,
      children: <Button onClick={onClick}>{faker.lorem.words()}</Button>
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the passed in button', () => {
    expect(wrapper.find('button').length).toEqual(1);
  });

  it('assigns the "badgeDefault" class to the badge by default', () => {
    const renderedBadge = wrapper.find('.badgeDefault');
    expect(renderedBadge).toHaveLength(1);
  });

  it('extends the badge class', () => {
    const fakeClassName = faker.lorem.word();

    const wrapper = renderButton(BadgedButton, {
      ...defaultProps,
      children: <Button onClick={onClick}>{faker.lorem.words()}</Button>,
      className: fakeClassName
    });
    const renderedBadge = wrapper.find('.badgeDefault');

    expect(renderedBadge.hasClass(fakeClassName)).toBe(true);
  });

  it('trims the longer strings to three characters', () => {
    const wrapper = renderButton(BadgedButton, {
      badgeContent: 'abcd',
      children: <Button onClick={onClick}>{faker.lorem.words()}</Button>
    });

    const renderedBadge = wrapper.find('.badgeDefault');

    expect(renderedBadge.text()).toBe('abc');
  });

  it('formats number greater than 99 to "99+"', () => {
    const wrapper = renderButton(BadgedButton, {
      badgeContent: 100,
      children: <Button onClick={onClick}>{faker.lorem.words()}</Button>
    });

    const renderedBadge = wrapper.find('.badgeDefault');

    expect(renderedBadge.text()).toBe('99+');
  });
});
