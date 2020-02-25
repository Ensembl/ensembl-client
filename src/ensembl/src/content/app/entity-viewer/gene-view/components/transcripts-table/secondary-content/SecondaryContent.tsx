import React from 'react';

import styles from './SecondaryContent.scss';
import tableStyles from '../TranscriptsTable.scss';

const SecondaryContent = () => {
  return (
    <div className={`${tableStyles.tableMiddle} ${styles.secondaryContent}`}>
      <div className={tableStyles.tableHeader}>
        <div className={tableStyles.tableRow}>
          <span className={tableStyles.tableCell}>Translation ID</span>
          <span className={tableStyles.tableCell}>UniProt</span>
          <span className={tableStyles.tableCell}>RefSeq match</span>
          <span className={tableStyles.tableCell}>CCDS</span>
          <span className={tableStyles.tableCell}>Flags</span>
        </div>
      </div>
      <div className={tableStyles.tableBody}>
        <div className={tableStyles.tableRow}>
          <span className={tableStyles.tableCell}>ENSP000000369497.3</span>
          <span className={tableStyles.tableCell}>P51587</span>
          <span className={tableStyles.tableCell}>-</span>
          <span className={tableStyles.tableCell}>CCDS9344</span>
          <span className={tableStyles.tableCell}>
            GENCODE basic, APPRIS PS1
          </span>
        </div>
        <div className={tableStyles.tableRow}>
          <span className={tableStyles.tableCell}>ENSP000000439902.1</span>
          <span className={tableStyles.tableCell}>P51587</span>
          <span className={tableStyles.tableCell}>-</span>
          <span className={tableStyles.tableCell}>-</span>
          <span className={tableStyles.tableCell}>
            GENCODE basic, APPRIS PS1
          </span>
        </div>
        <div className={tableStyles.tableRow}>
          <span className={tableStyles.tableCell}>ENSP000000</span>
          <span className={tableStyles.tableCell}>-</span>
          <span className={tableStyles.tableCell}>-</span>
          <span className={tableStyles.tableCell}>-</span>
          <span className={tableStyles.tableCell}>
            GENCODE basic, APPRIS PS1
          </span>
        </div>
      </div>
    </div>
  );
};

export default SecondaryContent;
