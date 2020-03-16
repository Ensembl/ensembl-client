import React from 'react';
import { mount } from 'enzyme';

import useRefWithRerender from '../useRefWithRerender';

describe('useRefWithRerender', () => {
  it('updates the component when ref.current value changes', async () => {
    const TestComponent = () => {
      const elementRef = useRefWithRerender<HTMLDivElement>(null);

      return (
        <div ref={elementRef}>
          {elementRef.current && (
            <div className="success">This should render</div>
          )}
        </div>
      );
    };

    const wrapper = mount(<TestComponent />);
    expect(wrapper.find('.success').length).toBe(1);
  });
});
