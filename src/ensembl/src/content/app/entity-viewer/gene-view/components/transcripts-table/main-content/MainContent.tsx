import React from 'react';

import styles from './MainContent.scss';
import tableStyles from '../TranscriptsTable.scss';

const MainContent = () => {
  return (
    <div className={`${tableStyles.tableMiddle} ${styles.mainContent}`}>
      <div className={tableStyles.tableHeader}>
        <div className={tableStyles.tableRow}>
          <span className={tableStyles.tableCell}>Biotype</span>
          <span className={tableStyles.tableCell}>Spliced RNA length</span>
          <span className={tableStyles.tableCell}>Coding exons</span>
          <span className={tableStyles.tableCell}>Protein</span>
          <span className={tableStyles.tableCell}>Transcript name</span>
          <span className={tableStyles.tableCell}>TSL</span>
        </div>
      </div>
      <div className={tableStyles.tableBody}>
        <div className={tableStyles.tableRow}>
          <span className={tableStyles.tableCell}>Protein coding</span>
          <span className={tableStyles.tableCell}>11,986</span>
          <span className={tableStyles.tableCell}>26 of 27</span>
          <span className={tableStyles.tableCell}>3418aa</span>
          <span className={tableStyles.tableCell}>BRCA2-201</span>
          <span className={tableStyles.tableCell}>TSL:5</span>
        </div>
        <div className={tableStyles.tableRow}>
          <span className={tableStyles.tableCell}>Protein coding</span>
          <span className={tableStyles.tableCell}>10,984</span>
          <span className={tableStyles.tableCell}>26 of 28</span>
          <span className={tableStyles.tableCell}>3418aa</span>
          <span className={tableStyles.tableCell}>BRCA2-206</span>
          <span className={tableStyles.tableCell}>TSL:1</span>
        </div>
        <div className={tableStyles.tableRow}>
          <span className={tableStyles.tableCell}>Protein coding</span>
          <span className={tableStyles.tableCell}>2,011</span>
          <span className={tableStyles.tableCell}>7 of 10</span>
          <span className={tableStyles.tableCell}>481aa</span>
          <span className={tableStyles.tableCell}>BRCA2-204</span>
          <span className={tableStyles.tableCell}>TSL:1</span>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
