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

import React, { useRef, MutableRefObject } from 'react';
import { render } from '@testing-library/react';

import FlatInput from './FlatInput';

describe('<FlatInput />', () => {
  it('forwards the ref to the input element', () => {
    let inputRef = null as MutableRefObject<HTMLInputElement | null> | null;
    const Wrapper = () => {
      inputRef = useRef<HTMLInputElement | null>(null);
      return <FlatInput ref={inputRef} />;
    };
    render(<Wrapper />);

    const inputElement = inputRef?.current;
    expect(inputElement?.tagName).toBe('INPUT');
  });

  it('renders the input as disabled if prop passed as true', () => {
    let { container } = render(<FlatInput disabled={true} />);
    expect(container.querySelector('.flatInputWrapper')?.classList).toContain(
      'flatInputWrapperDisabled'
    );

    container = render(<FlatInput disabled={false} />).container;
    expect(
      container.querySelector('.flatInputWrapper')?.classList
    ).not.toContain('flatInputWrapperDisabled');
  });

  it('renders icon if passed as props', () => {
    const MockIcon = () => <div className="mockIcon">Mock Icon</div>;
    let { container } = render(<FlatInput rightCorner={<MockIcon />} />);
    expect(container.querySelector('.rightCorner')).toBeTruthy();
    expect(container.querySelector('.mockIcon')).toBeTruthy();

    // doesn't render rightCorner when prop not passed
    container = render(<FlatInput />).container;
    expect(container.querySelector('.rightCorner')).toBeFalsy();
  });
});
