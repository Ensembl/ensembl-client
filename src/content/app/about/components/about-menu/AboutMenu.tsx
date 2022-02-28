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
import {
  MenuItem,
  MenuCollectionItem
} from 'src/shared/types/help-and-docs/menu';

import styles from './AboutMenu.scss';

type Props = {
  menu: MenuType;
  currentUrl: string;
};

export const TopMenu = (props: Props) => {
  return (
    <>
      {props.menu.items.map((item, index) => {
        const className = classNames(styles.topMenuLink, {
          [styles.activeLink]: hasItemWithUrl(item, props.currentUrl)
        });
        return (
          <Link className={className} to={item.url as string} key={index}>
            {item.name}
          </Link>
        );
      })}
    </>
  );
};

export const SideMenu = (props: Props) => {
  const { menu, currentUrl } = props;

  const topLevelMenuItem = menu.items.find(
    (menuItem) =>
      menuItem.type === 'collection' &&
      (menuItem.url === currentUrl ||
        menuItem.items.some((item) => item.url === currentUrl))
  ) as MenuCollectionItem;

  if (!topLevelMenuItem) {
    return null;
  }

  return (
    <>
      {topLevelMenuItem.url &&
        buildSideMenuLink(
          topLevelMenuItem as { name: string; url: string },
          currentUrl,
          -1
        )}
      {topLevelMenuItem.items.map((item, index) =>
        buildSideMenuLink(
          item as { name: string; url: string },
          currentUrl,
          index
        )
      )}
    </>
  );
};

const buildSideMenuLink = (
  menuItem: { name: string; url: string },
  currentUrl: string,
  index: number
) => {
  const { name, url } = menuItem;
  const linkClasses = classNames(styles.sideMenuLink, {
    [styles.activeLink]: url === currentUrl
  });

  return (
    <Link className={linkClasses} to={url} key={index}>
      {name}
    </Link>
  );
};

const hasItemWithUrl = (menuItem: MenuItem, url: string): boolean => {
  if (menuItem.url === url) {
    return true;
  } else if (menuItem.type === 'collection' && menuItem.items.length) {
    return menuItem.items.some((item) => hasItemWithUrl(item, url));
  }
  return false;
};
