import React from 'react';

import styles from './ScaleSwitcher.scss';

const ScaleSwitcher = () => {
  return (
    <div className={styles.container}>
      <div className={styles.emptyNode}></div>
      <div className={styles.emptyNode}></div>
      <div className={styles.emptyNode}></div>
      <div className={styles.selectedNode}>Gene</div>
      <div className={styles.emptyNode}></div>
      <div className={styles.emptyNode}></div>
      <div className={styles.emptyNode}></div>
    </div>
  );
};

export default ScaleSwitcher;