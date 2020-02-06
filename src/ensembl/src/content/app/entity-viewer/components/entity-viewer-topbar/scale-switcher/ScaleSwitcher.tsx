import React from 'react';

import styles from './ScaleSwitcher.scss';

const ScaleSwitcher = () => {
  return (
    <div className={styles.container}>
      {renderEmptyDots(3)}
      <div className={styles.selectedNode}>Gene</div>
      {renderEmptyDots(3)}
    </div>
  );
};

const renderEmptyDots = (number: number) => {
  return [...Array(number)].map((_, index) => <div key={index} className={styles.emptyNode} />);
}

export default ScaleSwitcher;
