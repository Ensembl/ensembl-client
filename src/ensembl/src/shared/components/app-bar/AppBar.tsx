import React from 'react';

import chevronRightIcon from 'static/img/shared/chevron-right-grey.svg';
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

// this is a temporary component; will need update/refactoring once we have help resources
export const HelpAndDocumentation = () => {
  return (
    <div className={styles.helpLink}>
      <a className="inactive">
        Help &amp; documentation <img src={chevronRightIcon} alt="" />
      </a>
    </div>
  );
};

export default AppBar;
