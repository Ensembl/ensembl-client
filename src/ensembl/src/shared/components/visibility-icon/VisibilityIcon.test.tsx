import React from 'react';
import { mount } from 'enzyme';

import { VisibilityIcon } from './VisibilityIcon';
import { Status } from 'src/shared/types/status';

describe('renders', () => {
  it('partially selected icon ', () => {
    const onClick = jest.fn();
    const wrapper = mount(
      <VisibilityIcon status={Status.PARTIALLY_SELECTED} onClick={onClick} />
    );
    expect(wrapper.find('.partiallySelected')).toHaveLength(1);
  });
});
