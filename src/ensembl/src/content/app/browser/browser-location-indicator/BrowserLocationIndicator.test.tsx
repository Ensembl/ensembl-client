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
import faker from 'faker';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { BrowserLocationIndicator } from './BrowserLocationIndicator';

import { ChrLocation } from '../browserState';

const chrName = faker.lorem.word();
const startPosition = faker.datatype.number({ min: 1, max: 1000000 });
const endPosition =
  startPosition + faker.datatype.number({ min: 1000, max: 1000000 });

const props = {
  location: [chrName, startPosition, endPosition] as ChrLocation,
  onClick: jest.fn(),
  disabled: false
};

describe('BrowserLocationIndicator', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('displays chromosome name', () => {
      const { container } = render(<BrowserLocationIndicator {...props} />);
      const renderedName = container.querySelector('.chrCode');
      expect(renderedName?.textContent).toBe(chrName);
    });

    it('displays location', () => {
      const { container } = render(<BrowserLocationIndicator {...props} />);
      const renderedLocation = container.querySelector('.chrRegion');
      expect(renderedLocation?.textContent).toBe(
        `${getCommaSeparatedNumber(startPosition)}-${getCommaSeparatedNumber(
          endPosition
        )}`
      );
    });

    it('adds disabled class when component is disabled', () => {
      const { container, rerender } = render(
        <BrowserLocationIndicator {...props} />
      );
      const element = container.firstChild as HTMLDivElement;
      expect(
        element.classList.contains('browserLocationIndicatorDisabled')
      ).toBe(false);

      rerender(<BrowserLocationIndicator {...props} disabled={true} />);
      expect(
        element.classList.contains('browserLocationIndicatorDisabled')
      ).toBe(true);
    });
  });

  describe('behaviour', () => {
    it('calls the onClick prop when clicked', () => {
      const { container } = render(<BrowserLocationIndicator {...props} />);
      const indicator = container.querySelector('.chrLocationView');

      userEvent.click(indicator as HTMLDivElement);
      expect(props.onClick).toHaveBeenCalled();
    });

    it('does not call the onClick prop if disabled', () => {
      const { container } = render(
        <BrowserLocationIndicator {...props} disabled={true} />
      );
      const indicator = container.querySelector('.chrLocationView');

      userEvent.click(indicator as HTMLDivElement);
      expect(props.onClick).not.toHaveBeenCalled();
    });
  });
});
