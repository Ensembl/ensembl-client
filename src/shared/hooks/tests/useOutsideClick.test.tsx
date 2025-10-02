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

import { useRef } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useOutsideClick from '../useOutsideClick';

const clickHandler = vi.fn();

const TestComponent = () => {
  const innerElementRef1 = useRef(null);
  const innerElementRef2 = useRef(null);
  const innerElementRef3 = useRef(null);

  useOutsideClick(
    [innerElementRef1, innerElementRef2, innerElementRef3],
    clickHandler
  );

  return (
    <div className="wrapper">
      <div className="test-element1" ref={innerElementRef1} />
      <div className="test-element2" ref={innerElementRef2} />
      <div className="test-element3" ref={innerElementRef3} />
    </div>
  );
};

describe('useOutsideClick', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('fires click handler if click is outside the host components', async () => {
    const { container } = render(<TestComponent />);
    const outerElement = container.querySelector('.wrapper') as HTMLElement;

    await userEvent.click(outerElement);

    expect(clickHandler).toHaveBeenCalled();
  });

  it('does not fire click handler if click was inside any of the host components', async () => {
    const { container } = render(<TestComponent />);
    const innerElement1 = container.querySelector(
      '.test-element1'
    ) as HTMLElement;
    const innerElement2 = container.querySelector(
      '.test-element2'
    ) as HTMLElement;
    const innerElement3 = container.querySelector(
      '.test-element3'
    ) as HTMLElement;

    await userEvent.click(innerElement1);
    await userEvent.click(innerElement2);
    await userEvent.click(innerElement3);

    expect(clickHandler).not.toHaveBeenCalled();
  });
});
