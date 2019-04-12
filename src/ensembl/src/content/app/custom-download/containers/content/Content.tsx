import React from 'react';
import styles from './Content.scss';
import DataSelector from '../../components/data-selector/DataSelector';
import ResultFilter from '../../components/result-filter/ResultFilter';
import TabButtons from '../../components/tab-buttons/TabButtons';
import ResultHolder from '../../components/result-holder/ResultHolder';

const Content = () => {
  return (
    <div>
      <div className={styles.resultList}>
        <ResultHolder />
      </div>
      <div className={styles.tabList}>
        <TabButtons />
      </div>
      <div className={styles.dataSelector}>
        <DataSelector />
        <ResultFilter />
      </div>
    </div>
  );
};

export default Content;
