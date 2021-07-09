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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders the main content in the main section', () => {
      const { container } = render(<StandardAppLayout {...minimalProps} />);
      const mainSection = container.querySelector('.main') as HTMLElement;
      expect(mainSection.querySelector('.mainContent')).toBeTruthy();
    });

    it('renders the top bar content in the top bar', () => {
      const { container } = render(<StandardAppLayout {...minimalProps} />);
      const topBar = container.querySelector('.topbar') as HTMLElement;
      expect(topBar.querySelector('.topbarContent')).toBeTruthy();
    });

    it('renders the sidebar content in the sidebar', () => {
      const { container } = render(<StandardAppLayout {...minimalProps} />);
      const sidebar = container.querySelector('.sidebar') as HTMLElement;
      expect(sidebar.querySelectorAll('.sidebarContent')).toBeTruthy();
    });

    it('renders sidebar navigation in appropriate slot', () => {
      const { container } = render(<StandardAppLayout {...minimalProps} />);
      const topBar = container.querySelector('.topbar') as HTMLElement;
      expect(topBar.querySelector('.sidebarNavigation')).toBeTruthy();
    });

    it('renders sidebar toolstrip content in the sidebar toolstrip', () => {
      const { container } = render(<StandardAppLayout {...minimalProps} />);
      const sidebarToolstrip = container.querySelector(
        '.sidebarToolstripContent'
      ) as HTMLElement;
      expect(sidebarToolstrip.querySelector('.toolstripContent')).toBeTruthy();
    });

    it('applies correct classes to the main section depending on whether sidebar is open', () => {
      // sidebar is open; main section is narrower
      const { container, rerender } = render(
        <StandardAppLayout {...minimalProps} />
      );
      const mainSection = container.querySelector('.main') as HTMLElement;

      expect(mainSection.classList.contains('mainDefault')).toBe(true);
      expect(mainSection.classList.contains('mainFullWidth')).toBe(false);

      // sidebar is closed; main section is wider
      rerender(<StandardAppLayout {...minimalProps} isSidebarOpen={false} />);
      expect(mainSection.classList.contains('mainDefault')).toBe(false);
      expect(mainSection.classList.contains('mainFullWidth')).toBe(true);
    });

    describe('with drawer', () => {
      const props = {
        ...minimalProps,
        isDrawerOpen: false,
        drawerContent: <DrawerContent />,
        onDrawerClose: jest.fn()
      };

      it('renders drawer content in the drawer', () => {
        const { container } = render(<StandardAppLayout {...props} />);
        const drawer = container.querySelector('.drawer') as HTMLElement;
        expect(drawer.querySelector('.drawerContent')).toBeTruthy();
      });

      it('applies correct classes to the sidebar/drawer wrapper', () => {
        const closedSidebarProps = {
          ...props,
          isSidebarOpen: false
        };
        const { container, rerender } = render(
          <StandardAppLayout {...closedSidebarProps} />
        );
        const sidebarWrapper = container.querySelector(
          '.sidebarWrapper'
        ) as HTMLElement;
        expect(sidebarWrapper.classList.contains('sidebarWrapperOpen')).toBe(
          false
        );
        expect(sidebarWrapper.classList.contains('sidebarWrapperClosed')).toBe(
          true
        );
        expect(
          sidebarWrapper.classList.contains('sidebarWrapperDrawerOpen')
        ).toBe(false);

        const openSidebarProps = props;
        rerender(<StandardAppLayout {...openSidebarProps} />);
        expect(sidebarWrapper.classList.contains('sidebarWrapperOpen')).toBe(
          true
        );
        expect(sidebarWrapper.classList.contains('sidebarWrapperClosed')).toBe(
          false
        );
        expect(
          sidebarWrapper.classList.contains('sidebarWrapperDrawerOpen')
        ).toBe(false);

        const openDrawerProps = {
          ...props,
          isDrawerOpen: true
        };
        rerender(<StandardAppLayout {...openDrawerProps} />);
        expect(sidebarWrapper.classList.contains('sidebarWrapperOpen')).toBe(
          true
        );
        expect(sidebarWrapper.classList.contains('sidebarWrapperClosed')).toBe(
          false
        );
        expect(
          sidebarWrapper.classList.contains('sidebarWrapperDrawerOpen')
        ).toBe(true);
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
        const { container } = render(<StandardAppLayout {...props} />);
        expect(container.querySelector('.sidebarNavigation')).toBeTruthy();
      });

      test('sidebar navigation tabs are not rendered for laptop viewport and smaller', () => {
        const { container } = render(
          <StandardAppLayout
            {...props}
            viewportWidth={BreakpointWidth.LAPTOP}
          />
        );
        expect(container.querySelector('.sidebarNavigation')).toBeFalsy();
      });
    });

    describe('with closed drawer', () => {
      const props = commonProps;

      it('calls onSidebarToggle when sidebar toggle button is clicked', () => {
        const { rerender, container } = render(
          <StandardAppLayout {...props} />
        );
        const sidebarToggleButton = container.querySelector(
          '.sidebarModeToggle button'
        ) as HTMLElement;
        userEvent.click(sidebarToggleButton);

        expect(props.onSidebarToggle).toHaveBeenCalledTimes(1);

        // do the same for closed sidebar
        rerender(<StandardAppLayout {...props} isSidebarOpen={false} />);
        userEvent.click(sidebarToggleButton);

        expect(props.onSidebarToggle).toHaveBeenCalledTimes(2);
        expect(props.onDrawerClose).not.toHaveBeenCalled();
      });
    });

    describe('with open drawer', () => {
      const props = { ...commonProps, isDrawerOpen: true };

      it('closes drawer when sidebar toggle button is clicked', () => {
        const { container } = render(<StandardAppLayout {...props} />);
        const sidebarToggleButton = container.querySelector(
          '.sidebarModeToggle button'
        ) as HTMLElement;
        userEvent.click(sidebarToggleButton);

        expect(props.onDrawerClose).toHaveBeenCalledTimes(1);
        expect(props.onSidebarToggle).not.toHaveBeenCalled();
      });

      it('closes drawer when drawer close button is clicked', () => {
        const { container } = render(<StandardAppLayout {...props} />);
        const closeDrawerButton = container.querySelector(
          '.drawerClose'
        ) as HTMLElement;
        userEvent.click(closeDrawerButton);

        expect(props.onDrawerClose).toHaveBeenCalledTimes(1);
      });

      it('closes drawer when drawer’s transparent window is clicked', () => {
        const { container } = render(<StandardAppLayout {...props} />);
        const drawerWindow = container.querySelector(
          '.drawerWindow'
        ) as HTMLElement;
        userEvent.click(drawerWindow);

        expect(props.onDrawerClose).toHaveBeenCalledTimes(1);
      });
    });
  });
});
