import React from 'react';
import styles from './AppBar.scss';

type AppBarProps = {
  appName?: string;
  mainContent: React.ReactNode;
  aside?: React.ReactNode;
};

export const AppBar = (props: AppBarProps) => (
  <section className={styles.appBar}>
    <div className={styles.appBarTop}>{props.appName}</div>
    <div className={styles.appBarMain}>{props.mainContent}</div>
    <div className={styles.appBarAside}>{props.aside}</div>
  </section>
);

export default AppBar;
