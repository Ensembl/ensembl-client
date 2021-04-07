import React from 'react';
import { useLocation } from 'react-router';

import useApiService from 'src/shared/hooks/useApiService';

import HelpMenu from './help-menu/HelpMenu';

import { Menu as MenuType } from 'src/shared/types/help-and-docs/menu';

import styles from './Help.scss';

const Help = () => {
  const location = useLocation();
  const { data: menu } = useApiService<MenuType>({
    endpoint: `/api/docs/menus?name=help`
  });

  console.log('menu', menu);

  return (
    <>
      <AppBar />
      <div>
        { menu &&
          <HelpMenu
            menu={menu}
            currentUrl={location.pathname}
          />
        }
        <div>I am main</div>
      </div>
    </>);
};

const AppBar = () => {
  return <div className={styles.appBar}>Help</div>;
};

export default Help;
