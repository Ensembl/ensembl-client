import React from 'react';

import styles from './StandardAppLayout.scss';

const StandardAppLayout = () => {
  return (
    <div className={styles.standardAppLayout}>
      <div className={styles.topBar}>I am top bar</div>
      <div className={styles.mainWrapper}>
        <div className={styles.main}>This is main</div>
        <div className={styles.sideBar}>I am sidebar</div>
      </div>
    </div>
  );
};

export default StandardAppLayout;
