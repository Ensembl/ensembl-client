import React from 'react';
import { render } from 'enzyme';

import FeatureLengthAxis from './FeatureLengthAxis';

const defaultProps = {
  length: 80792,
  width: 600
};

describe('FeatureLengthAxis', () => {
  describe('rendering', () => {
    it('renders inside an <svg> element if standalone', () => {
      const wrapper = render(
        <FeatureLengthAxis {...defaultProps} standalone={true} />
      );
      expect(wrapper.is('svg')).toBe(true);
    });

    it('renders inside a <g> element (svg group) if not standalone', () => {
      const wrapper = render(<FeatureLengthAxis {...defaultProps} />);
      expect(wrapper.is('g')).toBe(true);
    });
  });
});
