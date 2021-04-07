import React from 'react';
import { render } from "@testing-library/react";

import HelpMenu, { Props as HelpMenuProps } from './HelpMenu';

import menuData from './helpMenuFixture';

const defaultProps: HelpMenuProps = {
  menu: menuData,
  currentUrl: '/help'
};

const renderMenu = (props: Partial<HelpMenuProps> = {}) =>
  render(<HelpMenu {...defaultProps} {...props} />);

describe('<HelpMenu>', () => {

  describe('collapsed menu', () => {

    it('renders top-level menu items in the menu bar', () => {
      const { container } = renderMenu();
      const menuBar = container.querySelector('.menuBar') as HTMLElement;
      const topMenuItems = menuData.items.map(item => item.name);
      const renderedMenuItems = [...menuBar.querySelectorAll('.topMenuItem')];

      expect(topMenuItems.every(item => renderedMenuItems
        .find(element => element.textContent === item))
      ).toBe(true);
    });

  });

});
