import React from 'react';
import { mount } from 'enzyme';

import { VisibilityIcon } from './VisibilityIcon';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import { Status } from 'src/shared/types/status';

describe('<VisibilityIcon />', () => {
  it('renders ImageButton with DEFAULT status when partially selected', () => {
    const onClick = jest.fn();
    const wrapper = mount(
      <VisibilityIcon status={Status.PARTIALLY_SELECTED} onClick={onClick} />
    );
    expect(wrapper.find(ImageButton).prop('status')).toBe(Status.DEFAULT);
  });
});
