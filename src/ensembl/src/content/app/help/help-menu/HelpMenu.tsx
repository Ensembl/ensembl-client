import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Menu as MenuType, MenuItem } from 'src/shared/types/help-and-docs/menu';

import styles from './HelpMenu.scss';

export type Props = {
  menu: MenuType,
  currentUrl: string;
};

const HelpMenu = (props: Props) => {
  const [ submenuItems, setSubmenuItems ] = useState<MenuItem[] | null>(null);


  const closePanel = () => setSubmenuItems(null);

  const topLevelItems = props.menu.items.map((item, index) => {
    const className = classNames(
      styles.topMenuItem
    );
    const onMouseEnter = item.type === 'collection'
      ? () => setSubmenuItems(item.items)
      : () => setSubmenuItems(null);
    return (
      <span
        className={className}
        key={index}
        onMouseEnter={onMouseEnter}
      >
        {item.name}
      </span>
    )
  });

  return (
    <div className={styles.helpMenu}>
      <div className={styles.menuBar}>
        { topLevelItems }
      </div>
      { 
        submenuItems && (
          <>
            <div className={styles.expandedMenuPanel}>
              <Submenu items={submenuItems} />
            </div>           
            <div
              className={styles.backdrop}
              onMouseEnter={(closePanel)}
              onClick={closePanel}
            />
          </>
        )
      }
    </div>);
};


type SubmenuProps = {
  items: MenuItem[];
};
const Submenu = (props: SubmenuProps) => {
  const [childItems, setChildItems] = useState<MenuItem[] | null>(null);

  useEffect(() => {
    setChildItems(null);
  }, props.items);

  const renderedMenuItems = props.items.map((item, index) => {
    const className = classNames(
      styles.submenuItem
    );
    const props: { onMouseOver?: () => void } = {};
    if (item.type === 'collection') {
      props.onMouseOver = () => setChildItems(item.items);
    } else {
      props.onMouseOver = () => setChildItems(null);
    }
    return (
      <li key={index} { ...props } className={className}>
        {item.name}
      </li>
    );
  });

  const renderedSubmenu = (
    <ul className={styles.submenu}>
      {renderedMenuItems}
    </ul>
  );

  return childItems
  ? <>
      { renderedSubmenu}
      <Submenu items={childItems}/>
    </>
  : renderedSubmenu;
};


// FIXME: remove?
const buildMenuId = (menuItem: MenuItem) =>
  `${menuItem.type}-${menuItem.name}`;

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
