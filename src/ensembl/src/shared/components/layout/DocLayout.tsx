import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './DocLayout.scss';

type DocLayoutProps = {
  mainContent: ReactNode;
  appHeaderContent: ReactNode;
  searchBoxContent: ReactNode;
  globalNavContent: ReactNode;
  localNavContent: ReactNode;
};

const DocLayout = (props: DocLayoutProps) => {
  const mainClassNames = classNames(styles.main);
  const globalNavClassnames = classNames(styles.globalNav);
  const localNavClassnames = classNames(styles.localNav);
  const appHeaderClassnames = classNames(styles.appHeader);
  const searchBoxClassnames = classNames(styles.searchBox);

  return (
    <div className={styles.docLayout}>
      <div className={appHeaderClassnames}>{props.appHeaderContent}</div>
      <div className={searchBoxClassnames}>{props.searchBoxContent}</div>
      <div className={globalNavClassnames}>{props.globalNavContent}</div>
      <div className={mainClassNames}>{props.mainContent}</div>
      <div className={localNavClassnames}>{props.localNavContent}</div>
    </div>
  );
};

DocLayout.defaultProps = {};

export default DocLayout;
