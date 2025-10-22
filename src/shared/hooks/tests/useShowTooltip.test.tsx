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

import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useShowTooltip } from '../useShowTooltip';

import { TOOLTIP_TIMEOUT } from 'src/shared/components/tooltip/tooltip-constants';


let triggerTooltipCloseSignal: () => void;

const TestComponent = () => {
  const { elementRef, onClick, onTooltipCloseSignal, shouldShowTooltip } =
    useShowTooltip();

  triggerTooltipCloseSignal = onTooltipCloseSignal;

  return (
    <div className="test-element" ref={elementRef} onClick={onClick}>
      Element with tooltip
      {shouldShowTooltip && (
        <span data-test-id="tooltip">
          I am not a tooltip really, but just imagine that I am.
        </span>
      )}
    </div>
  );
};

beforeAll(() => {
  // Somehow, somewhere, the testing library is tightly coupled with Jest,
  // (because, accodring to its devs, "it is the most popular testing framework").
  // As a result, it becomes necessary, in non-jest environments,
  // if use of fake timers is needed, to stub the `jest` global object.
  // See:
  //   - https://github.com/testing-library/react-testing-library/issues/1197
  //   - https://github.com/testing-library/user-event/issues/1115
  vi.stubGlobal("jest", {
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
  });
});

afterAll(() => {
  vi.unstubAllGlobals();
});

const userEventWithFakeTimers = userEvent.setup({
  advanceTimers: vi.advanceTimersByTime
});

describe('useShowTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  describe('useShowTooltip with on click', () => {
    it('toggles the tooltip', async () => {
      const { container, queryByTestId } = render(<TestComponent />);
      const testElement = container.querySelector(
        '.test-element'
      ) as HTMLElement;

      await userEventWithFakeTimers.click(testElement);

      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(queryByTestId('tooltip')).toBeTruthy();
    });

    it('takes precedence over hover', async () => {
      const { container, queryByTestId } = render(<TestComponent />);
      const testElement = container.querySelector(
        '.test-element'
      ) as HTMLElement;

      await userEventWithFakeTimers.hover(testElement); // would start the timer
      await userEventWithFakeTimers.click(testElement); // would clear the timer and toggle the state to show the tooltip

      act(() => {
        vi.advanceTimersByTime(0); // the tooltip should appear instantaneously
      });
      expect(queryByTestId('tooltip')).toBeTruthy();
    });

    it('does not hide the tooltip on mouseleave', async () => {
      const { container, queryByTestId } = render(<TestComponent />);
      const testElement = container.querySelector(
        '.test-element'
      ) as HTMLElement;

      await userEventWithFakeTimers.click(testElement);

      act(() => {
        vi.advanceTimersByTime(0);
      });

      await userEventWithFakeTimers.unhover(testElement); // <-- should have no effect on the tooltip
      expect(queryByTestId('tooltip')).toBeTruthy();
    });
  });

  describe('useShowTooltip with on hover', () => {
    it('shows the tooltip after a delay', async () => {
      const { container, queryByTestId } = render(<TestComponent />);
      const testElement = container.querySelector(
        '.test-element'
      ) as HTMLElement;

      await userEventWithFakeTimers.hover(testElement);
      expect(queryByTestId('tooltip')).toBeFalsy();

      // moving the timer to simulate the delay before the tooltip is shown
      act(() => {
        vi.advanceTimersByTime(TOOLTIP_TIMEOUT);
      });

      expect(queryByTestId('tooltip')).toBeTruthy();
    });

    it('hides the tooltip on mouseleave', async () => {
      const { container, queryByTestId } = render(<TestComponent />);
      const testElement = container.querySelector(
        '.test-element'
      ) as HTMLElement;

      await userEventWithFakeTimers.hover(testElement);

      // making sure that the tooltip got shown
      await waitFor(() => {
        expect(queryByTestId('tooltip')).toBeTruthy();
      });

      await userEventWithFakeTimers.unhover(testElement);
      expect(queryByTestId('tooltip')).toBeFalsy();
    });
  });

  describe('onTooltipCloseSignal', () => {
    it('allows the tooltip to tell the hook to hide it', async () => {
      const { container, queryByTestId } = render(<TestComponent />);

      // Show the tooltip
      const testElement = container.querySelector(
        '.test-element'
      ) as HTMLElement;

      await userEventWithFakeTimers.click(testElement);

      // make sure that the tooltip is shown
      await waitFor(() => {
        expect(queryByTestId('tooltip')).toBeTruthy();
      });

      // Now pretend that the tooltip sent a signal for closing
      // (e.g. if the user clicked outside the tooltip)
      triggerTooltipCloseSignal();

      act(() => {
        vi.advanceTimersByTime(TOOLTIP_TIMEOUT);
      });

      expect(queryByTestId('tooltip')).toBeFalsy();
    });
  });
});
