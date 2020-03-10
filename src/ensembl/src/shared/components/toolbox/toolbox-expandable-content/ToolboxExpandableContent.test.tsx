import React from 'react';
import { mount } from 'enzyme';

import HoverboxExpandableContent from './ToolboxExpandableContent';

const MainContent = () => <div>This is main content</div>;
const FooterContent = () => <div>This is footer content</div>;

const minimalProps = {
  mainContent: <MainContent />,
  footerContent: <FooterContent />
};

describe('<HoverboxExpandableContent />', () => {
  it('renders only main content by default', () => {
    const wrapper = mount(<HoverboxExpandableContent {...minimalProps} />);

    expect(wrapper.exists(MainContent)).toBe(true);
    expect(wrapper.exists(FooterContent)).toBe(false);
  });

  it('shows footer content if footer is opened', () => {
    const wrapper = mount(<HoverboxExpandableContent {...minimalProps} />);
    const toggleButton = wrapper.find('.toggleButton');
    toggleButton.simulate('click');

    expect(wrapper.exists(FooterContent)).toBe(true);
  });

  // add test about the icon that is renteded by toggle button
});
