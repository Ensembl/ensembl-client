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

import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';

import { ImageButton, Props as ImageButtonProps } from './ImageButton';

import { Status } from 'src/shared/types/status';

vi.mock('src/shared/components/tooltip/Tooltip', () => ({
  default: ({ children }: { children: any }) => (
    <div className="tooltip">{children}</div>
  )
}));

const defaultProps = {
  image: '/image.svg'
};

describe('<ImageButton />', () => {
  const renderImageButton = (props: Partial<ImageButtonProps> = {}) =>
    render(<ImageButton {...defaultProps} {...props} />);

  describe('rendering', () => {
    it('renders without error', () => {
      expect(() => renderImageButton().container).not.toThrow();
    });

    it('renders an img tag if a path to an image file is passed', () => {
      const { container } = renderImageButton({ image: 'foo.png' });
      expect(
        container.querySelector('button img')?.getAttribute('src')
      ).toEqual('foo.png');
    });

    it('sets alt text when rendering img element if provided with description', () => {
      const { container, rerender } = renderImageButton();
      expect(container.querySelector('img')?.alt).toEqual('');

      rerender(<ImageButton {...defaultProps} description="foo" />);
      expect(container.querySelector('img')?.alt).toEqual('foo');
    });

    it('renders the svg element if provided with React svg component', () => {
      const mockSVG = () => {
        return <svg className="test_svg" />;
      };

      const container = renderImageButton({ image: mockSVG }).container;
      expect(container.querySelector('button .test_svg')).toBeTruthy();
    });

    it('applies the appropriate css class to the button depending on its status', () => {
      // default status
      const { container, rerender } = renderImageButton();
      const imageButton = container.querySelector(
        '.imageButton'
      ) as HTMLButtonElement;

      expect(imageButton.classList.contains(Status.DEFAULT)).toBe(true);

      rerender(<ImageButton {...defaultProps} status={Status.SELECTED} />);
      expect(imageButton.classList.contains(Status.DEFAULT)).toBe(false);
      expect(imageButton.classList.contains(Status.SELECTED)).toBe(true);

      rerender(<ImageButton {...defaultProps} status={Status.UNSELECTED} />);
      expect(imageButton.classList.contains(Status.SELECTED)).toBe(false);
      expect(imageButton.classList.contains(Status.UNSELECTED)).toBe(true);

      rerender(<ImageButton {...defaultProps} status={Status.DISABLED} />);
      expect(imageButton.classList.contains(Status.UNSELECTED)).toBe(false);
      expect(imageButton.classList.contains(Status.DISABLED)).toBe(true);
    });

    it('applies the class name passed from the parent to the button', () => {
      const customClassName = 'classFromParent';
      const { container } = renderImageButton({ className: customClassName });
      const imageButton = container.querySelector(
        '.imageButton'
      ) as HTMLButtonElement;

      expect(imageButton.classList.contains(customClassName)).toBe(true);
    });
  });

  describe('behaviour on click', () => {
    const onClick = vi.fn();
    afterEach(() => {
      vi.resetAllMocks();
    });

    it('calls the onClick prop when clicked', async () => {
      const { container } = renderImageButton({ onClick });
      const imageButton = container.querySelector(
        'button'
      ) as HTMLButtonElement;
      await userEvent.click(imageButton);

      expect(onClick).toHaveBeenCalled();
    });

    it('does not call the onClick prop when clicked if the status is disabled', async () => {
      const { container } = renderImageButton({
        onClick,
        status: Status.DISABLED
      });
      const imageButton = container.querySelector(
        '.imageButton'
      ) as HTMLButtonElement;
      await userEvent.click(imageButton);

      expect(onClick).not.toHaveBeenCalled();
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

    it('shows tooltip when moused over', async () => {
      const { container } = renderImageButton(props);
      expect(container.querySelector('.tooltip')).toBeFalsy();

      // Have to mouse specifically over the button wrapper (top-level element rendered by the ImageButton component).
      // Because, it seems, the mouseEnter event doesn't bubble from the button to the button wrapper in the test environment ¯\_(ツ)_/¯
      const imageButton = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(imageButton);

      const tooltip = container.querySelector('.tooltip');
      expect(tooltip?.textContent).toBe(description);
    });

    it('does not show tooltip if clicked', async () => {
      const { container } = renderImageButton(props);
      const imageButton = container.querySelector(
        '.imageButton'
      ) as HTMLElement;

      fireEvent.mouseEnter(imageButton);
      await userEvent.click(imageButton);

      expect(container.querySelector('.tooltip')).toBeFalsy();
    });

    it('does not show tooltip if description is not provided', () => {
      const { container } = renderImageButton();
      const imageButton = container.querySelector(
        '.imageButton'
      ) as HTMLElement;

      fireEvent.mouseEnter(imageButton);

      expect(container.querySelector('.tooltip')).toBeFalsy();
    });
  });
});
