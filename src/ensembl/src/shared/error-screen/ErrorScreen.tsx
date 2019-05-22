import React from 'react';

import { HomeLink, ReleaseVersion, Copyright } from 'src/header/Header';

import styles from './ErrorScreen.scss';
import headerStyles from 'src/header/Header.scss';

export const NewTechError = () => {
  return (
    <div className={styles.newTechErrorWrapper}>
      <div className={styles.newTechMessage}>
        Sorry, but it seems your browser can’t display the newq site
      </div>
      <a href="https://www.ensembl.org" className={styles.errorLinkButton}>
        Go to Ensembl classic
      </a>
    </div>
  );
};

export const GeneralErrorScreen = () => (
  <section>
    <header className={headerStyles.topBar}>
      <HomeLink />
      <ReleaseVersion />
      <Copyright />
    </header>
    <div />
  </section>
);
