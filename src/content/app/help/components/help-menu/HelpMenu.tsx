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

import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import useHelpAppAnalytics from '../../hooks/useHelpAppAnalytics';

import Chevron from 'src/shared/components/chevron/Chevron';
import HelpMenuLink from './HelpMenuLink';

import {
  Menu as MenuType,
  MenuArticleItem,
  MenuItem
} from 'src/shared/types/help-and-docs/menu';

import styles from './HelpMenu.scss';

export type Props = {
  menu: MenuType;
  currentUrl: string;
};

const HelpMenu = (props: Props) => {
  const [submenuItems, setSubmenuItems] = useState<MenuItem[] | null>(null);
  const clickedMenuRef = useRef<number | null>(null);

  const { trackTopLevelMenu } = useHelpAppAnalytics();

  const toggleMegaMenu = (
    items: MenuItem[],
    menuIndex: number,
    menuName: string
  ) => {
    let nextValue = null;
    if (
      clickedMenuRef.current === null ||
      clickedMenuRef.current !== menuIndex
    ) {
      // clicking on a menu item for the first time
      clickedMenuRef.current = menuIndex;
      nextValue = items;
    } else {
      // this means a repeated click on the same menu item
      clickedMenuRef.current = null;
    }
    setSubmenuItems(nextValue);
    nextValue && trackTopLevelMenu(menuName);
  };

  const handleHelpMenuLinkClick = (menuName: string) => {
    closeMegaMenu();
    trackTopLevelMenu(menuName);
  };

  const closeMegaMenu = () => {
    setSubmenuItems(null);
    clickedMenuRef.current = null;
  };

  const topLevelItems = props.menu.items.map((item, index) => {
    const className = classNames(styles.topMenuItem);
    const commonProps = {
      key: index,
      className
    };

    return item.type === 'collection' ? (
      <span
        {...commonProps}
        onClick={() => toggleMegaMenu(item.items, index, item.name)}
      >
        {item.name}
      </span>
    ) : (
      <HelpMenuLink
        {...commonProps}
        to={item.url}
        onClick={() => handleHelpMenuLinkClick(item.name)}
      >
        {item.name}
      </HelpMenuLink>
    );
  });

  return (
    <div className={styles.helpMenu}>
      <div className={styles.menuBar}>{topLevelItems}</div>
      {submenuItems && (
        <>
          <div className={styles.expandedMenuPanel}>
            <Submenu items={submenuItems} onLinkClick={closeMegaMenu} />
          </div>
          <div
            className={styles.backdrop}
            onMouseEnter={closeMegaMenu}
            onClick={closeMegaMenu}
          />
        </>
      )}
    </div>
  );
};

type SubmenuProps = {
  items: MenuItem[];
  onLinkClick: () => void;
};
const Submenu = (props: SubmenuProps) => {
  const [childItems, setChildItems] = useState<MenuItem[] | null>(null);
  const navigate = useNavigate();

  const { trackMegaNavItemClick } = useHelpAppAnalytics();

  useEffect(() => {
    setChildItems(null);
  }, [props.items]);

  const onLinkClick = (item: MenuArticleItem) => {
    // hopefully, the url is an internal one;
    // might need extra logic if we can have external urls in the menu
    props.onLinkClick();
    navigate(item.url);
    trackMegaNavItemClick(item.name, item.type);
  };

  const renderedMenuItems = props.items.map((item, index) => {
    const className = classNames(styles.submenuItem);
    const menuItemProps: Record<string, unknown> = {};

    if (item.type === 'collection') {
      menuItemProps.onMouseOver = () => setChildItems(item.items);
    } else {
      menuItemProps.onMouseOver = () => setChildItems(null);
      menuItemProps.onClick = () => onLinkClick(item);
    }
    return (
      <li key={index} {...menuItemProps} className={className}>
        {item.type === 'collection' ? (
          <>
            {item.name}
            <Chevron direction="right" className={styles.chevron} />
          </>
        ) : (
          item.name
        )}
      </li>
    );
  });

  const renderedSubmenu = (
    <ul className={styles.submenu}>{renderedMenuItems}</ul>
  );

  return childItems ? (
    <>
      {renderedSubmenu}
      <Submenu items={childItems} onLinkClick={props.onLinkClick} />
    </>
  ) : (
    renderedSubmenu
  );
};

export default HelpMenu;
