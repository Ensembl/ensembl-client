import React from 'react';
import classNames from 'classnames';

import styles from './PanelTwo.scss';
import tableStyles from '../TranscriptsTable.scss';

const PanelTwo = () => {
  const rowClassNames = classNames(tableStyles.tableRow, styles.tableRow);

  return (
    <div className={tableStyles.tableMiddle}>
      <div className={tableStyles.tableHeader}>
        <div className={rowClassNames}>
          <div className={tableStyles.tableCell}>Biotype</div>
          <div className={tableStyles.tableCell}>Spliced RNA length</div>
          <div className={tableStyles.tableCell}>Coding exons</div>
          <div className={tableStyles.tableCell}>Protein</div>
          <div className={tableStyles.tableCell}>Transcript name</div>
          <div className={tableStyles.tableCell}>TSL</div>
        </div>
      </div>
      <div className={tableStyles.tableBody}>
        <div className={rowClassNames}>
          <div className={tableStyles.tableCell}>Protein coding</div>
          <div className={tableStyles.tableCell}>11,986 bp</div>
          <div className={tableStyles.tableCell}>26 of 27</div>
          <div className={tableStyles.tableCell}>3,418 aa</div>
          <div className={tableStyles.tableCell}>BRCA2-201</div>
          <div className={tableStyles.tableCell}>TSL:5</div>
        </div>
        <div className={rowClassNames}>
          <div className={tableStyles.tableCell}>Protein coding</div>
          <div className={tableStyles.tableCell}>10,984 bp</div>
          <div className={tableStyles.tableCell}>26 of 28</div>
          <div className={tableStyles.tableCell}>3,418 aa</div>
          <div className={tableStyles.tableCell}>BRCA2-206</div>
          <div className={tableStyles.tableCell}>TSL:1</div>
        </div>
        <div className={rowClassNames}>
          <div className={tableStyles.tableCell}>Protein coding</div>
          <div className={tableStyles.tableCell}>2,011 bp</div>
          <div className={tableStyles.tableCell}>7 of 10</div>
          <div className={tableStyles.tableCell}>481 aa</div>
          <div className={tableStyles.tableCell}>BRCA2-204</div>
          <div className={tableStyles.tableCell}>TSL:1</div>
        </div>
      </div>
    </div>
  );
};

export default PanelTwo;
