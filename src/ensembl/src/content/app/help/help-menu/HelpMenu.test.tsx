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

import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';

import HelpMenu, { Props as HelpMenuProps } from './HelpMenu';

import menuData from './helpMenuFixture';

jest.mock('react-router-dom', () => ({
  Link: (props: { children: ReactNode }) => (
    <a className="topMenuItem" data-test-id="react-router-link">
      {props.children}
    </a>
  )
}));

const reduxStore = configureMockStore()({});

const defaultProps: HelpMenuProps = {
  menu: menuData,
  currentUrl: '/help'
};

const renderMenu = (props: Partial<HelpMenuProps> = {}) =>
  render(
    <Provider store={reduxStore}>
      <HelpMenu {...defaultProps} {...props} />
    </Provider>
  );

describe('<HelpMenu>', () => {
  describe('collapsed menu', () => {
    it('renders top-level menu items in the menu bar', () => {
      const { container } = renderMenu();
      const menuBar = container.querySelector('.menuBar') as HTMLElement;
      const topMenuItems = menuData.items.map((item) => item.name);
      const renderedMenuItems = [...menuBar.querySelectorAll('.topMenuItem')];

      expect(
        topMenuItems.every((item) =>
          renderedMenuItems.find((element) => element.textContent === item)
        )
      ).toBe(true);
    });

    it('opens the megamenu when clicked', () => {
      const { container, getByText } = renderMenu();
      expect(container.querySelector('.expandedMenuPanel')).toBeFalsy; // start with a closed megamenu
      expect(() => getByText('Viewing Ensembl data')).toThrow(); // getByText will throw if it can't find an element
      const itemWithSubmenu = getByText('Using Ensembl');

      userEvent.click(itemWithSubmenu);

      const expandedMenuPanel = container.querySelector('.expandedMenuPanel');
      const submenuItem = getByText('Viewing Ensembl data');

      expect(expandedMenuPanel).toBeTruthy();
      expect(expandedMenuPanel?.contains(submenuItem)).toBe(true);
    });
  });

  describe('expanded menu', () => {
    it('contains expandable submenus', () => {
      const { container, getByText } = renderMenu();
      const itemWithSubmenu = getByText('Using Ensembl');

      userEvent.click(itemWithSubmenu);
      const expandedMenuPanel = container.querySelector(
        '.expandedMenuPanel'
      ) as HTMLElement;

      expect(expandedMenuPanel.querySelectorAll('.submenu').length).toBe(1);

      const submenuItem = getByText('Viewing Ensembl data'); // this item corresponds to a collection of other menu items
      userEvent.hover(submenuItem);

      // hovering over a submenu collection item should expand another submenu
      expect(expandedMenuPanel.querySelectorAll('.submenu').length).toBe(2);
    });
  });
});
