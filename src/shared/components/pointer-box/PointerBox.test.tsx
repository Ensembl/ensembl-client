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

import PointerBox from './PointerBox';

describe('<PointerBox />', () => {
  let anchor: HTMLDivElement;

  beforeEach(() => {
    anchor = document.createElement('div');
    document.body.appendChild(anchor);
  });

  afterEach(() => {
    document.body.removeChild(anchor);
  });

  it('renders at the top level of document.body by default', () => {
    render(<PointerBox anchor={anchor}>{faker.lorem.paragraph()}</PointerBox>);

    expect(document.querySelectorAll('body > .pointerBox').length).toBe(1);
  });

  it('can render inside anchor element', () => {
    render(
      <PointerBox anchor={anchor} renderInsideAnchor={true}>
        {faker.lorem.paragraph()}
      </PointerBox>
    );

    expect(document.querySelectorAll('body > .pointerBox').length).toBe(0);
    expect(anchor.querySelector('.pointerBox')).toBeTruthy();
  });
});
