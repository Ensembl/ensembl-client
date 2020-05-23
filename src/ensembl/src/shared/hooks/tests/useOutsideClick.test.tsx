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

import React, { useRef } from 'react';
import { mount, ReactWrapper } from 'enzyme';

import useOutsideClick from '../useOutsideClick';

const clickHandler = jest.fn();

const TestComponent = () => {
  const innerElementRef = useRef(null);
  useOutsideClick(innerElementRef, clickHandler);

  return (
    <div className="wrapper">
      <div className="test-element" ref={innerElementRef} />
    </div>
  );
};

describe('useOutsideClick', () => {
  let rootElement: HTMLDivElement;
  let wrapper: ReactWrapper;
  const clickEvent = new Event('click', { bubbles: true });

  beforeEach(() => {
    rootElement = document.createElement('div');
    document.body.appendChild(rootElement);
    wrapper = mount(<TestComponent />, { attachTo: rootElement });
  });

  afterEach(() => {
    wrapper.detach();
    document.body.removeChild(rootElement);
    jest.resetAllMocks();
  });

  it('fires click handler if click is outside the host component', async () => {
    const outerElement = wrapper.find('.wrapper').getDOMNode();
    outerElement.dispatchEvent(clickEvent);

    expect(clickHandler).toHaveBeenCalled();
  });

  it('does not fire click handler if click was inside the host component', async () => {
    const innerElement = wrapper.find('.test-element').getDOMNode();

    innerElement.dispatchEvent(clickEvent);

    expect(clickHandler).not.toHaveBeenCalled();
  });
});
