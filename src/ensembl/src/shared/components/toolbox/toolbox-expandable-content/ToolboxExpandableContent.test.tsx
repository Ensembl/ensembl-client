import React from 'react';
import { mount } from 'enzyme';

import ToolboxExpandableContent, {
  ToggleButton
} from './ToolboxExpandableContent';

const MainContent = () => (
  <div>
    <span>This is main content</span>
    <ToggleButton openElement={<span>Click me!</span>} />
  </div>
);
const FooterContent = () => <div>This is footer content</div>;

const minimalProps = {
  mainContent: <MainContent />,
  footerContent: <FooterContent />
};

describe('<ToolboxExpandableContent />', () => {
  it('renders only main content by default', () => {
    const wrapper = mount(<ToolboxExpandableContent {...minimalProps} />);

    expect(wrapper.exists(MainContent)).toBe(true);
    expect(wrapper.exists(FooterContent)).toBe(false);
  });

  it('shows footer content when ToggleButton is clicked', () => {
    const wrapper = mount(<ToolboxExpandableContent {...minimalProps} />);
    const toggleButton = wrapper.find(ToggleButton);
    toggleButton.simulate('click');

    expect(wrapper.exists(FooterContent)).toBe(true);
  });
});
