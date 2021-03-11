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
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { Menu as MenuType } from 'src/shared/types/help-and-docs/menu';

import styles from './AboutMenu.scss';

type Props = {
  menu: MenuType;
  currentUrl: string;
};

export const TopMenu = (props: Props) => {
  const { menu } = props;

  // This is a bit of a hack
  // Only take the first article from every collection of articles
  const menuItems = menu.data.map((menuItem) => {
    if (menuItem.type === 'collection') {
      return menuItem.items[0];
    } else {
      return menuItem;
    }
  });

  return (
    <>
      {menuItems.map((item, index) => (
        <Link
          className={styles.topMenuLink}
          to={item.url as string}
          key={index}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
};

export const SideMenu = (props: Props) => {
  const { menu, currentUrl } = props;

  const menuItem = menu.data.find(
    (menuItem) =>
      menuItem.type === 'collection' &&
      menuItem.items.find((item) => item.url === currentUrl)
  );

  if (!menuItem || menuItem.type !== 'collection') {
    // this shouldn't happen
    return null;
  }

  return (
    <>
      {menuItem.items.map((item, index) => {
        const linkClasses = classNames(styles.sideMenuLink, {
          [styles.activeLink]: item.url === currentUrl
        });
        return (
          <Link className={linkClasses} to={item.url as string} key={index}>
            {item.name}
          </Link>
        );
      })}
    </>
  );
};
