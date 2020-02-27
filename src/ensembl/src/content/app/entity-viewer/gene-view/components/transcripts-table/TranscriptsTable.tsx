import React, { useState } from 'react';

import PanelTwo from './panel-two/PanelTwo';
import PanelThree from './panel-three/PanelThree';
import { ImageButton } from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as chevronLeftIcon } from 'static/img/shared/chevron-left.svg';
import { ReactComponent as chevronRightIcon } from 'static/img/shared/chevron-right.svg';

import { Status } from 'src/shared/types/status';

import styles from './TranscriptsTable.scss';

const TranscriptsTable = () => {
  const [currentPanel, setCurrentPanel] = useState(1);

  const toPreviousPanel = () => {
    if (currentPanel === 1) {
      setCurrentPanel(3);
    } else {
      setCurrentPanel(currentPanel - 1);
    }
  };

  const toNextPanel = () => {
    if (currentPanel === 3) {
      setCurrentPanel(1);
    } else {
      setCurrentPanel(currentPanel + 1);
    }
  };

  const getCurrentTableMiddleComponent = () => {
    switch (currentPanel) {
      case 1:
        return null;
      case 2:
        return <PanelTwo />;
      case 3:
        return <PanelThree />;
    }
  };

  return (
    <div className={styles.table}>
      <div className={styles.tableLeftWing}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <div className={styles.tableCell}>
              <span className={styles.paginationNumber}>
                <span
                  className={styles.currentPaginationNumber}
                >{`0${currentPanel}`}</span>
                / 03
              </span>
              <ImageButton
                onClick={toPreviousPanel}
                image={chevronLeftIcon}
                classNames={{ [Status.DEFAULT]: styles.paginationButton }}
              />
            </div>
          </div>
        </div>
        <div className={styles.tableBody}>
          <div className={styles.tableRow}>
            <div className={styles.tableCell}>Ensembl select</div>
          </div>
        </div>
      </div>
      {getCurrentTableMiddleComponent()}
      <div className={styles.transcriptIdColumn}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <div className={styles.tableCell}>Transcript ID</div>
          </div>
        </div>
        <div className={styles.tableBody}>
          <div className={styles.tableRow}>
            <div className={styles.tableCell}>ENST000000380152.7</div>
          </div>
          <div className={styles.tableRow}>
            <div className={styles.tableCell}>ENST000000544455.5</div>
          </div>
          <div className={styles.tableRow}>
            <div className={styles.tableCell}>ENST000000530893.6</div>
          </div>
        </div>
      </div>
      <div className={styles.tableRightWing}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <div className={styles.tableCell}>
              <ImageButton
                onClick={toNextPanel}
                image={chevronRightIcon}
                classNames={{ [Status.DEFAULT]: styles.paginationButton }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tableFilters}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <div className={styles.tableCell}>Filter transcripts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptsTable;
