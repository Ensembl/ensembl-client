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

import { PrimaryButton, SecondaryButton } from './Button';

const onClick = jest.fn();

const defaultProps = {
  onClick
};

const renderButton = (
  ButtonComponent: React.FunctionComponent<any>,
  props: any = defaultProps
) => mount(<ButtonComponent {...props} />);

describe('PrimaryButton', () => {
  let wrapper: any;
  let buttonChildren: any;

  beforeEach(() => {
    buttonChildren = faker.lorem.words();
    wrapper = renderButton(PrimaryButton, {
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

  test('assigns the primaryButton class to the button', () => {
    const renderedButton = wrapper.find('button');
    expect(renderedButton.hasClass('primaryButton')).toBe(true);
  });

  test('extends own class with external classname', () => {
    const externalClass = faker.lorem.word();
    const wrapper = renderButton(PrimaryButton, {
      ...defaultProps,
      children: buttonChildren,
      className: externalClass
    });
    const renderedButton = wrapper.find('button');

    expect(renderedButton.hasClass('primaryButton')).toBe(true);
    expect(renderedButton.hasClass(externalClass)).toBe(true);
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
    const wrapper = renderButton(PrimaryButton, {
      ...defaultProps,
      children: buttonChildren,
      isDisabled: true
    });
    wrapper.simulate('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('SecondaryButton', () => {
  // same as primary, but has a different class

  let wrapper: any;
  let buttonChildren: any;

  beforeEach(() => {
    buttonChildren = faker.lorem.words();
    wrapper = renderButton(SecondaryButton, {
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

  test('assigns the secondaryButton class to the button', () => {
    const renderedButton = wrapper.find('button');
    expect(renderedButton.hasClass('secondaryButton')).toBe(true);
  });

  test('extends own class with external classname', () => {
    const externalClass = faker.lorem.word();
    const wrapper = renderButton(SecondaryButton, {
      ...defaultProps,
      children: buttonChildren,
      className: externalClass
    });
    const renderedButton = wrapper.find('button');

    expect(renderedButton.hasClass('secondaryButton')).toBe(true);
    expect(renderedButton.hasClass(externalClass)).toBe(true);
  });

  test('contains passed children', () => {
    const renderedButton = wrapper.find('button');
    expect(renderedButton.text()).toBe(buttonChildren);
  });

  test('calls onClick when clicked', () => {
    wrapper.simulate('click');
    expect(onClick).toHaveBeenCalled();
  });
});
