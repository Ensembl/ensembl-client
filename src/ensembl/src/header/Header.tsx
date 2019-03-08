import React, { memo, FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import HeaderButtons from './header-buttons/HeaderButtons';
import LaunchbarContainer from './launchbar/LaunchbarContainer';
import Account from './account/Account';

import homeIcon from 'static/img/header/home.svg';

import styles from './Header.scss';

type HeaderProps = {};

export const Header: FunctionComponent<HeaderProps> = () => (
  <header>
    <div className={styles.topBar}>
      <div>
        <div className={styles.homeLink}>
          <Link to="/">
            <img src={homeIcon} alt="" /> Ensembl
          </Link>
        </div>
        <div className={styles.strapline}>Pre-release - March 2019</div>
        <div className={styles.copyright}>
          <a href="https://www.ebi.ac.uk" target="_blank">
            &copy; EMBL-EBI
          </a>
        </div>
      </div>
      <HeaderButtons />
    </div>
    <Account />
    <LaunchbarContainer />
  </header>
);

export default memo(Header);
