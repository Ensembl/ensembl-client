import React, { useState } from 'react';

import MainContent from './main-content/MainContent';
import SecondaryContent from './secondary-content/SecondaryContent';
import { ImageButton } from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as chevronLeftIcon } from 'static/img/shared/chevron-left.svg';
import { ReactComponent as chevronRightIcon } from 'static/img/shared/chevron-right.svg';

import { Status } from 'src/shared/types/status';

import styles from './TranscriptsTable.scss';

const TranscriptsTable = () => {
  const [paginationNumber, setPaginationNumber] = useState(1);

  const gotoPrevious = () => {
    if (paginationNumber > 1) {
      setPaginationNumber(paginationNumber - 1);
    }
  };

  const gotoNext = () => {
    if (paginationNumber < 3) {
      setPaginationNumber(paginationNumber + 1);
    }
  };

  const getCurrentTableMiddleComponent = () => {
    switch (paginationNumber) {
      case 1:
        return null;
      case 2:
        return <MainContent />;
      case 3:
        return <SecondaryContent />;
    }
  };

  return (
    <div className={styles.table}>
      <div className={styles.tableLeftWing}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <span className={styles.tableCell}>
              <span className={styles.paginationNumber}>
                <span
                  className={styles.currentPaginationNumber}
                >{`0${paginationNumber}`}</span>
                / 03
              </span>
              <ImageButton
                onClick={gotoPrevious}
                image={chevronLeftIcon}
                classNames={{ [Status.DEFAULT]: styles.paginationButton }}
              />
            </span>
          </div>
        </div>
        <div className={styles.tableBody}>
          <div className={styles.tableRow}>
            <span className={styles.tableCell}>Ensembl select</span>
          </div>
        </div>
      </div>
      {getCurrentTableMiddleComponent()}
      <div className={styles.transcriptIdColumn}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <span className={styles.tableCell}>Transcript ID</span>
          </div>
        </div>
        <div className={styles.tableBody}>
          <div className={styles.tableRow}>
            <span className={styles.tableCell}>ENST000000380152.7</span>
          </div>
          <div className={styles.tableRow}>
            <span className={styles.tableCell}>ENST000000544455.5</span>
          </div>
          <div className={styles.tableRow}>
            <span className={styles.tableCell}>ENST000000530893.6</span>
          </div>
        </div>
      </div>
      <div className={styles.tableRightWing}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <span className={styles.tableCell}>
              <ImageButton
                onClick={gotoNext}
                image={chevronRightIcon}
                classNames={{ [Status.DEFAULT]: styles.paginationButton }}
              />
            </span>
          </div>
        </div>
      </div>
      <div className={styles.tableFilters}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <span className={styles.tableCell}>Filter transcripts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptsTable;
