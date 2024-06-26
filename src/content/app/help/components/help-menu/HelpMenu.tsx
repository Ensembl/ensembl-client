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

import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { useNavigate, useLocation } from 'react-router-dom';

import useHelpAppAnalytics from '../../hooks/useHelpAppAnalytics';

import Chevron from 'src/shared/components/chevron/Chevron';
import HelpMenuLink from './HelpMenuLink';

import {
  Menu as MenuType,
  MenuArticleItem,
  MenuItem
} from 'src/shared/types/help-and-docs/menu';

import styles from './HelpMenu.module.css';

export type Props = {
  menu: MenuType;
  currentUrl: string;
};

const HelpMenu = (props: Props) => {
  const [submenuItems, setSubmenuItems] = useState<MenuItem[] | null>(null);
  const clickedMenuRef = useRef<number | null>(null);

  const { pathname } = useLocation();
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

  const getTopLevelMenuItemClasses = (index: number) =>
    classNames(styles.topMenuItem, {
      [styles.topMenuItemActive]: clickedMenuRef.current === index
    });

  const getHelpMenuLinkClasses = (url: string) =>
    classNames(styles.topMenuItem, {
      [styles.topMenuItemActive]:
        pathname === url && clickedMenuRef.current === null
    });

  const topLevelItems = props.menu.items.map((item, index) => {
    return item.type === 'collection' ? (
      <span
        key={index}
        className={getTopLevelMenuItemClasses(index)}
        onClick={() => toggleMegaMenu(item.items, index, item.name)}
      >
        {item.name}
        <Chevron
          direction={clickedMenuRef.current === index ? 'up' : 'down'}
          animate={true}
          className={styles.chevronVertical}
        />
      </span>
    ) : (
      <HelpMenuLink
        key={index}
        to={item.url}
        className={getHelpMenuLinkClasses(item.url)}
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
  const submenuElementRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  const { trackMegaNavItemClick } = useHelpAppAnalytics();

  useEffect(() => {
    setChildItems(null);
  }, [props.items]);

  useEffect(() => {
    // make sure that the newly opened submenu is always in user's view
    const submenuElement = submenuElementRef.current as HTMLElement;
    submenuElement.scrollIntoView({ behavior: 'smooth' });
  }, []);

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
      menuItemProps.onClick = () => setChildItems(item.items);
    } else {
      menuItemProps.onClick = () => {
        setChildItems(null);
        onLinkClick(item);
      };
    }
    return (
      <li key={index} {...menuItemProps} className={className}>
        {item.type === 'collection' ? (
          <>
            {item.name}
            <Chevron direction="right" className={styles.chevronHorizontal} />
          </>
        ) : (
          item.name
        )}
      </li>
    );
  });

  const renderedSubmenu = (
    <ul className={styles.submenu} ref={submenuElementRef}>
      {renderedMenuItems}
    </ul>
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
