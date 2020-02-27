import React from 'react';
import classNames from 'classnames';

import styles from './PanelThree.scss';
import tableStyles from '../TranscriptsTable.scss';

const PanelThree = () => {
  const rowClassNames = classNames(tableStyles.tableRow, styles.tableRow);

  return (
    <div className={tableStyles.tableMiddle}>
      <div className={tableStyles.tableHeader}>
        <div className={rowClassNames}>
          <div className={tableStyles.tableCell}>Translation ID</div>
          <div className={tableStyles.tableCell}>UniProt</div>
          <div className={tableStyles.tableCell}>RefSeq match</div>
          <div className={tableStyles.tableCell}>CCDS</div>
          <div className={tableStyles.tableCell}>Flags</div>
        </div>
      </div>
      <div className={tableStyles.tableBody}>
        <div className={rowClassNames}>
          <div className={tableStyles.tableCell}>ENSP000000369497.3</div>
          <div className={tableStyles.tableCell}>P51587</div>
          <div className={tableStyles.tableCell}>-</div>
          <div className={tableStyles.tableCell}>CCDS9344</div>
          <div className={tableStyles.tableCell}>GENCODE basic, APPRIS PS1</div>
        </div>
        <div className={rowClassNames}>
          <div className={tableStyles.tableCell}>ENSP000000439902.1</div>
          <div className={tableStyles.tableCell}>P51587</div>
          <div className={tableStyles.tableCell}>-</div>
          <div className={tableStyles.tableCell}>-</div>
          <div className={tableStyles.tableCell}>GENCODE basic, APPRIS PS1</div>
        </div>
        <div className={rowClassNames}>
          <div className={tableStyles.tableCell}>ENSP000000</div>
          <div className={tableStyles.tableCell}>-</div>
          <div className={tableStyles.tableCell}>-</div>
          <div className={tableStyles.tableCell}>-</div>
          <div className={tableStyles.tableCell}>GENCODE basic, APPRIS PS1</div>
        </div>
      </div>
    </div>
  );
};

export default PanelThree;
