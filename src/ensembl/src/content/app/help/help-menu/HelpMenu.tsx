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

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { ReactComponent as Chevron } from 'static/img/shared/chevron-right.svg';

import {
  Menu as MenuType,
  MenuItem
} from 'src/shared/types/help-and-docs/menu';

import styles from './HelpMenu.scss';

export type Props = {
  menu: MenuType;
  currentUrl: string;
};

const HelpMenu = (props: Props) => {
  const [submenuItems, setSubmenuItems] = useState<MenuItem[] | null>(null);

  const closePanel = () => setSubmenuItems(null);

  const topLevelItems = props.menu.items.map((item, index) => {
    const className = classNames(styles.topMenuItem);
    const onMouseEnter =
      item.type === 'collection'
        ? () => setSubmenuItems(item.items)
        : () => setSubmenuItems(null);
    return (
      <span className={className} key={index} onMouseEnter={onMouseEnter}>
        {item.name}
      </span>
    );
  });

  return (
    <div className={styles.helpMenu}>
      <div className={styles.menuBar}>{topLevelItems}</div>
      {submenuItems && (
        <>
          <div className={styles.expandedMenuPanel}>
            <Submenu items={submenuItems} />
          </div>
          <div
            className={styles.backdrop}
            onMouseEnter={closePanel}
            onClick={closePanel}
          />
        </>
      )}
    </div>
  );
};

type SubmenuProps = {
  items: MenuItem[];
};
const Submenu = (props: SubmenuProps) => {
  const [childItems, setChildItems] = useState<MenuItem[] | null>(null);

  useEffect(() => {
    setChildItems(null);
  }, [props.items]);

  const renderedMenuItems = props.items.map((item, index) => {
    const className = classNames(styles.submenuItem);
    const props: { onMouseOver?: () => void } = {};
    if (item.type === 'collection') {
      props.onMouseOver = () => setChildItems(item.items);
    } else {
      props.onMouseOver = () => setChildItems(null);
    }
    return (
      <li key={index} {...props} className={className}>
        {item.type === 'collection' ? (
          <>
            {item.name}
            <Chevron className={styles.chevron} />
          </>
        ) : (
          <Link to={item.url}>{item.name}</Link>
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
      <Submenu items={childItems} />
    </>
  ) : (
    renderedSubmenu
  );
};

export default HelpMenu;

/*
// const [pathToChildren, setPathToChildren] = useState<string[]>([]);


type RenderSubmenuItemsParams = {
  items: MenuItem[];
  pathToSubmenu: string[];
  indexToPathPart: number;
  onExpandSubmenu: (id: string) => void;
};
const renderSubmenuItems = (params: RenderSubmenuItemsParams): ReactNode => {
  const { items, pathToSubmenu, indexToPathPart } = params;
  const pathPart = pathToSubmenu[indexToPathPart];

  if (!pathPart) {
    return null;
  }

  const menuItem = items.find(item => buildMenuId(item) === pathPart) as MenuItem;

  if (menuItem.type !== 'collection') {
    // shouldn't happen, but better be careful
    return null;
  }

  const submenuItems = menuItem.items;
  const renderedSubmenuItems = submenuItems.map((item, index) => {
    return (
      <li key={index}>
        {item.name}
      </li>
    );
  });
  const submenu = <ul key={pathPart}>{renderedSubmenuItems}</ul>

  return [
    submenu,
    renderSubmenuItems({
      ...params,
      items: menuItem.items,
      indexToPathPart: indexToPathPart + 1
    })
  ]
};

type ExpandedMenuPanelProps = {
  pathToSubmenu: string[],
  menu: MenuType,
  updateOpenSubmenu: (newPath: string[]) => void;
};

const ExpandedMenuPanel = (props: ExpandedMenuPanelProps) => {
  const { menu, pathToSubmenu } = props;

  const renderedSubmenus = pathToSubmenu.reduce((elements, pathPart) => {
    const relevantMenuItem = menu
  });
};

*/
