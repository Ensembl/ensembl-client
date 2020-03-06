import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './DocLayout.scss';

type DocLayoutProps = {
  mainContent: ReactNode;
  sidebarContent: ReactNode;
};

const DocLayout = (props: DocLayoutProps) => {
  const mainClassNames = classNames(styles.main);
  const sidebarWrapperClassnames = classNames(styles.sidebarWrapper);

  return (
    <div className={styles.docLayout}>
      <div className={styles.mainWrapper}>
        <div className={mainClassNames}>{props.mainContent}</div>
        <div className={sidebarWrapperClassnames}>
          <div className={styles.sidebar}>{props.sidebarContent}</div>
        </div>
      </div>
    </div>
  );
};

DocLayout.defaultProps = {};

export default DocLayout;
