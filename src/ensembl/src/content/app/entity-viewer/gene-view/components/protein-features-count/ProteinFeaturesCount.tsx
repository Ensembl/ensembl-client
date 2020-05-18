import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import {
  ProteinStats,
  fetchProteinSummaryStats
} from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/proteinData';

import structuresIcon from 'EBI-Icon-fonts/EBI-Conceptual/static/svg/structures.svg';
import ligandsIcon from 'EBI-Icon-fonts/EBI-Conceptual/static/svg/chemical.svg';
import interactionsIcon from 'EBI-Icon-fonts/EBI-Conceptual/static/svg/systems.svg';
import annotationsIcon from 'EBI-Icon-fonts/EBI-Conceptual/static/svg/cross-domain.svg';

import transcriptListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.scss';
import styles from './ProteinFeaturesCount.scss';

type ProteinFeaturesCountProps = {
  transcriptId: string;
};

const ProteinFeaturesCount = (props: ProteinFeaturesCountProps) => {
  const [proteinStats, setProteinStats] = useState<ProteinStats | null>(null);

  useEffect(() => {
    fetchProteinSummaryStats(props.transcriptId).then((response) => {
      setProteinStats(response);
    });
  }, [props.transcriptId]);

  if (!proteinStats) {
    return null;
  }

  const midStyles = classNames(transcriptListStyles.middle, styles.middle);

  return (
    <div className={transcriptListStyles.row}>
      <div className={transcriptListStyles.left}>PDBe-KB P51587</div>
      <div className={midStyles}>
        <div className={styles.feature}>
          <div className={styles.featureImg}>
            <img src={structuresIcon} alt="" />
          </div>
          <div className={styles.featureCount}>
            {proteinStats.structuresCount}
          </div>
          <div className={styles.featureText}>Structures</div>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureImg}>
            <img src={ligandsIcon} alt="" />
          </div>
          <div className={styles.featureCount}>{proteinStats.ligandsCount}</div>
          <div className={styles.featureText}>Ligands</div>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureImg}>
            <img src={interactionsIcon} alt="" />
          </div>
          <div className={styles.featureCount}>
            {proteinStats.interactionsCount}
          </div>
          <div className={styles.featureText}>Interactions</div>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureImg}>
            <img src={annotationsIcon} alt="" />
          </div>
          <div className={styles.featureCount}>
            {proteinStats.annotationsCount}
          </div>
          <div className={styles.featureText}>Functional annotations</div>
        </div>
      </div>
    </div>
  );
};

export default ProteinFeaturesCount;
