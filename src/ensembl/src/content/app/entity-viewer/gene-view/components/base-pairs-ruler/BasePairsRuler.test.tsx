import React from 'react';
import { mount, render } from 'enzyme';

import BasePairsRuler from './BasePairsRuler';

const defaultProps = {
  length: 80792,
  width: 600
};

describe('<BasePairsRuler />', () => {
  describe('rendering', () => {
    it('renders inside an <svg> element if standalone', () => {
      const wrapper = render(
        <BasePairsRuler {...defaultProps} standalone={true} />
      );
      expect(wrapper.is('svg')).toBe(true);
    });

    it('renders inside a <g> element (svg group) if not standalone', () => {
      const wrapper = render(<BasePairsRuler {...defaultProps} />);
      expect(wrapper.is('g')).toBe(true);
    });
  });

  describe('behaviour', () => {
    const props = {
      ...defaultProps,
      standalone: true
    };

    it('passes calculated ticks to the callback', () => {
      const callback = jest.fn();
      mount(<BasePairsRuler {...props} onTicksCalculated={callback} />);
      expect(callback).toHaveBeenCalledTimes(1);

      const payload = callback.mock.calls[0][0];
      expect(payload.ticks).toBeDefined();
      expect(payload.labelledTicks).toBeDefined();
    });
  });
});
