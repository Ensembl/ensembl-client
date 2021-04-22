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

  const toggleMegaMenu = (items: MenuItem[]) => {
    const nextValue = submenuItems ? null : items;
    setSubmenuItems(nextValue);
  };

  const closeMegaMenu = () => setSubmenuItems(null);

  const topLevelItems = props.menu.items.map((item, index) => {
    const className = classNames(styles.topMenuItem);
    const commonProps = {
      key: index,
      className
    };
    return item.type === 'collection' ? (
      <span {...commonProps} onClick={() => toggleMegaMenu(item.items)}>
        {item.name}
      </span>
    ) : (
      <Link {...commonProps} to={item.url}>
        {item.name}
      </Link>
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
