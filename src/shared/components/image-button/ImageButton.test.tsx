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
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';

import { ImageButton, Props as ImageButtonProps } from './ImageButton';

import { Status } from 'src/shared/types/status';

jest.mock(
  'src/shared/components/tooltip/Tooltip',
  () => ({ children }: { children: any }) => (
    <div className="tooltip">{children}</div>
  )
);

const defaultProps = {
  image: ''
};

describe('<ImageButton />', () => {
  const renderImageButton = (props: Partial<ImageButtonProps> = {}) =>
    render(<ImageButton {...defaultProps} {...props} />);

  it('renders without error', () => {
    expect(() => renderImageButton().container).not.toThrow();
  });

  describe('prop status', () => {
    it('has a status set by default', () => {
      const container = renderImageButton().container;
      expect(
        container
          .querySelectorAll('.imageButton')[0]
          .classList.contains(Status.DEFAULT)
      ).toBeTruthy();
    });
  });

  describe('prop description', () => {
    it('has a description set by default', () => {
      const container = renderImageButton().container;
      expect(container.querySelector('img')?.alt).toEqual('');
    });

    it('respects the description prop', () => {
      const container = renderImageButton({ description: 'foo' }).container;
      expect(container.querySelector('img')?.alt).toEqual('foo');
    });
  });

  describe('prop image', () => {
    it('has an image set by default', () => {
      const container = renderImageButton().container;
      expect(container.querySelector('img')?.getAttribute('src')).toEqual('');
    });

    it('renders an img tag if a path to an image file is passed', () => {
      const container = renderImageButton({ image: 'foo.png' }).container;
      expect(
        container.querySelector('button img')?.getAttribute('src')
      ).toEqual('foo.png');
    });

    it('renders the svg file passed in', () => {
      const mockSVG = () => {
        return <svg className="test_svg" />;
      };

      const container = renderImageButton({ image: mockSVG }).container;
      expect(container.querySelector('button .test_svg')).toBeTruthy();
    });
  });

  describe('prop classNames', () => {
    it('applies the default className when no status is provided', () => {
      const container = renderImageButton().container;

      expect(container.querySelectorAll('.default')).toHaveLength(1);
    });

    it('applies the respective className depending on the button status', () => {
      const container = renderImageButton({ status: Status.SELECTED })
        .container;

      expect(container.querySelectorAll('.selected')).toHaveLength(1);
    });
  });

  describe('prop onClick', () => {
    const onClick = jest.fn();
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('calls the onClick prop when clicked', () => {
      const container = renderImageButton({ onClick }).container;
      userEvent.click(container.querySelectorAll('button')[0]);

      expect(onClick).toBeCalled();
    });

    it('does not call the onClick prop when clicked if the status is disabled', () => {
      const container = renderImageButton({
        onClick,
        status: Status.DISABLED
      }).container;

      userEvent.click(container.querySelectorAll('button')[0]);

      expect(onClick).not.toBeCalled();
    });
  });

  describe('tooltip on hover', () => {
    const mockSVG = () => {
      return <svg className="test-svg" />;
    };
    const description = faker.lorem.words();
    const props = {
      image: mockSVG,
      description
    };
    it('shows tooltip when moused over', () => {
      const container = renderImageButton(props).container;
      expect(container.querySelectorAll('.tooltip').length).toBe(0);

      fireEvent.mouseEnter(container.querySelectorAll('.imageButton')[0]);

      const tooltip = container.querySelectorAll('.tooltip');
      expect(tooltip).toHaveLength(1);
      expect(tooltip[0].textContent).toBe(description);
    });

    it('does not show tooltip if clicked', () => {
      const container = renderImageButton(props).container;

      fireEvent.mouseEnter(container.querySelectorAll('.imageButton')[0]);
      userEvent.click(container.querySelectorAll('.imageButton')[0]);

      expect(container.querySelectorAll('.tooltip').length).toBe(0);
    });

    it('does not show tooltip if description is not provided', () => {
      const container = renderImageButton({ ...props, description: '' })
        .container;

      fireEvent.mouseEnter(container.querySelectorAll('.imageButton')[0]);

      expect(container.querySelectorAll('.tooltip').length).toBe(0);
    });
  });
});
