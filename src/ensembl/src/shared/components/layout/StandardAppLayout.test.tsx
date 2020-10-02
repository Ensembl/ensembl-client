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
import { mount, render } from 'enzyme';
import faker from 'faker';

import StandardAppLayout from './StandardAppLayout';

import { BreakpointWidth } from 'src/global/globalConfig';

const MainContent = () => (
  <div className="mainContent">This is main content</div>
);
const SidebarContent = () => (
  <div className="sidebarContent">This is sidebar content</div>
);
const TopbarContent = () => (
  <div className="topbarContent">This is topbar content</div>
);

const SidebarToolstripContent = () => (
  <div className="toolstripContent">This is topbar content</div>
);

const DrawerContent = () => (
  <div className="drawerContent">This is drawer content</div>
);

const SidebarNavigation = () => (
  <div className="sidebarNavigation">This is sidebar navigation</div>
);

const sidebarNavigationLinks = [...Array(3)].map(() => ({
  label: faker.random.word(),
  isActive: false
}));
const activeSidebarNavLinkIndex = Math.floor(
  Math.random() * sidebarNavigationLinks.length
);
sidebarNavigationLinks[activeSidebarNavLinkIndex].isActive = true;

const minimalProps = {
  mainContent: <MainContent />,
  sidebarContent: <SidebarContent />,
  sidebarToolstripContent: <SidebarToolstripContent />,
  topbarContent: <TopbarContent />,
  isSidebarOpen: true,
  sidebarNavigation: <SidebarNavigation />,
  onSidebarToggle: jest.fn(),
  viewportWidth: BreakpointWidth.DESKTOP
};

describe('StandardAppLayout', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders the main content in the main section', () => {
      const wrapper = render(<StandardAppLayout {...minimalProps} />);
      expect(wrapper.find('.main').find('.mainContent').length).toBe(1);
    });

    it('renders the top bar content in the top bar', () => {
      const wrapper = render(<StandardAppLayout {...minimalProps} />);
      expect(wrapper.find('.topbar').find('.topbarContent').length).toBe(1);
    });

    it('renders the sidebar content in the sidebar', () => {
      const wrapper = render(<StandardAppLayout {...minimalProps} />);
      expect(wrapper.find('.sidebar').find('.sidebarContent').length).toBe(1);
    });

    it('renders sidebar navigation in appropriate slot', () => {
      const wrapper = render(<StandardAppLayout {...minimalProps} />);
      expect(wrapper.find('.topbar').find('.sidebarNavigation').length).toBe(1);
    });

    it('renders sidebar toolstrip content in the sidebar toolstrip', () => {
      const wrapper = render(<StandardAppLayout {...minimalProps} />);
      expect(
        wrapper.find('.sidebarToolstripContent').find('.toolstripContent')
          .length
      ).toBe(1);
    });

    it('applies correct classes to the main section depending on whether sidebar is open', () => {
      // sidebar is open; main section is narrower
      let wrapper, mainContent;
      wrapper = render(<StandardAppLayout {...minimalProps} />);
      mainContent = wrapper.find('.main');
      expect(mainContent.hasClass('mainDefault')).toBe(true);
      expect(mainContent.hasClass('mainFullWidth')).toBe(false);

      // sidebar is closed; main section is wider
      wrapper = render(
        <StandardAppLayout {...minimalProps} isSidebarOpen={false} />
      );
      mainContent = wrapper.find('.main');
      expect(mainContent.hasClass('mainDefault')).toBe(false);
      expect(mainContent.hasClass('mainFullWidth')).toBe(true);
    });

    describe('with drawer', () => {
      const props = {
        ...minimalProps,
        isDrawerOpen: false,
        drawerContent: <DrawerContent />,
        onDrawerClose: jest.fn()
      };

      it('renders drawer content in the drawer', () => {
        const wrapper = render(<StandardAppLayout {...props} />);
        expect(wrapper.find('.drawer').find('.drawerContent').length).toBe(1);
      });

      it('applies correct classes to the sidebar/drawer wrapper', () => {
        let wrapper, sidebarWrapper;
        const closedSidebarProps = {
          ...props,
          isSidebarOpen: false
        };
        wrapper = render(<StandardAppLayout {...closedSidebarProps} />);
        sidebarWrapper = wrapper.find('.sidebarWrapper');
        expect(sidebarWrapper.hasClass('sidebarWrapperOpen')).toBe(false);
        expect(sidebarWrapper.hasClass('sidebarWrapperClosed')).toBe(true);
        expect(sidebarWrapper.hasClass('sidebarWrapperDrawerOpen')).toBe(false);

        const openSidebarProps = props;
        wrapper = render(<StandardAppLayout {...openSidebarProps} />);
        sidebarWrapper = wrapper.find('.sidebarWrapper');
        expect(sidebarWrapper.hasClass('sidebarWrapperOpen')).toBe(true);
        expect(sidebarWrapper.hasClass('sidebarWrapperClosed')).toBe(false);
        expect(sidebarWrapper.hasClass('sidebarWrapperDrawerOpen')).toBe(false);

        const openDrawerProps = {
          ...props,
          isDrawerOpen: true
        };
        wrapper = render(<StandardAppLayout {...openDrawerProps} />);
        sidebarWrapper = wrapper.find('.sidebarWrapper');
        expect(sidebarWrapper.hasClass('sidebarWrapperOpen')).toBe(true);
        expect(sidebarWrapper.hasClass('sidebarWrapperClosed')).toBe(false);
        expect(sidebarWrapper.hasClass('sidebarWrapperDrawerOpen')).toBe(true);
      });
    });
  });

  describe('behaviour', () => {
    const commonProps = {
      ...minimalProps,
      isDrawerOpen: false,
      drawerContent: <DrawerContent />,
      onDrawerClose: jest.fn()
    };

    describe('sidebar navigation tabs when sidebar is closed', () => {
      const props = { ...commonProps, isSidebarOpen: false };

      test('sidebar navigation tabs are rendered for desktop viewport and larger', () => {
        const wrapper = mount(<StandardAppLayout {...props} />);
        expect(wrapper.find('.sidebarNavigation').length).toBe(1);
      });

      test('sidebar navigation tabs are not rendered for laptop viewport and smaller', () => {
        const wrapper = mount(
          <StandardAppLayout
            {...props}
            viewportWidth={BreakpointWidth.LAPTOP}
          />
        );
        expect(wrapper.find('.sidebarNavigation').length).toBe(0);
      });
    });

    describe('with closed drawer', () => {
      const props = commonProps;

      it('calls onSidebarToggle when sidebar toggle button is clicked', () => {
        const wrapper = mount(<StandardAppLayout {...props} />);
        wrapper.find('.sidebarModeToggleChevron').simulate('click');

        expect(props.onSidebarToggle).toHaveBeenCalledTimes(1);

        // do the same for closed sidebar
        wrapper.setProps({ isSidebarOpen: false });
        wrapper.find('.sidebarModeToggleChevron').simulate('click');

        expect(props.onSidebarToggle).toHaveBeenCalledTimes(2);
        expect(props.onDrawerClose).not.toHaveBeenCalled();
      });
    });

    describe('with open drawer', () => {
      const props = { ...commonProps, isDrawerOpen: true };

      it('closes drawer when sidebar toggle button is clicked', () => {
        const wrapper = mount(<StandardAppLayout {...props} />);
        wrapper.find('.sidebarModeToggleChevron').simulate('click');

        expect(props.onDrawerClose).toHaveBeenCalledTimes(1);
        expect(props.onSidebarToggle).not.toHaveBeenCalled();
      });

      it('closes drawer when drawer close button is clicked', () => {
        const wrapper = mount(<StandardAppLayout {...props} />);
        wrapper.find('.drawerClose').simulate('click');

        expect(props.onDrawerClose).toHaveBeenCalledTimes(1);
      });

      it('closes drawer when drawer’s transparent window is clicked', () => {
        const wrapper = mount(<StandardAppLayout {...props} />);
        wrapper.find('.drawerWindow').simulate('click');

        expect(props.onDrawerClose).toHaveBeenCalledTimes(1);
      });
    });
  });
});
