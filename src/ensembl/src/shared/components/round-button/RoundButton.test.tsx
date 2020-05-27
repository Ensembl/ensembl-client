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

import RoundButton, { RoundButtonStatus } from './RoundButton';

const onClick = jest.fn();

const defaultProps = {
  onClick
};

const renderButton = (
  ButtonComponent: React.FunctionComponent<any>,
  props: any = defaultProps
) => mount(<ButtonComponent {...props} />);

describe('RoundButton', () => {
  let wrapper: any;
  let buttonChildren: any;

  beforeEach(() => {
    buttonChildren = faker.lorem.words();
    wrapper = renderButton(RoundButton, {
      ...defaultProps,
      children: buttonChildren
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders a button', () => {
    expect(wrapper.find('button').length).toEqual(1);
  });

  test('assigns the "default" class to the button', () => {
    const renderedButton = wrapper.find('button');
    expect(renderedButton.hasClass('default')).toBe(true);
  });

  test('applies additional classes depending on the status', () => {
    const wrapper = renderButton(RoundButton, {
      ...defaultProps,
      children: buttonChildren,
      status: RoundButtonStatus.ACTIVE
    });
    const renderedButton = wrapper.find('button');

    expect(renderedButton.hasClass('default')).toBe(true);
    expect(renderedButton.hasClass('active')).toBe(true);
  });

  test('contains passed children', () => {
    const renderedButton = wrapper.find('button');
    expect(renderedButton.text()).toBe(buttonChildren);
  });

  test('calls onClick when clicked', () => {
    wrapper.simulate('click');
    expect(onClick).toHaveBeenCalled();
  });

  test('does not call onClick if disabled', () => {
    const wrapper = renderButton(RoundButton, {
      ...defaultProps,
      children: buttonChildren,
      status: RoundButtonStatus.DISABLED
    });
    wrapper.simulate('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});
