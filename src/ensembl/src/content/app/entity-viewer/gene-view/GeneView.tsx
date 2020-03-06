import React from 'react';

import styles from './GeneView.scss';
import InfoButtonStrip from './components/info-button-strip/InfoButtonStrip';

const GeneView = () => (
  <div className={styles.geneView}>
    <div className={styles.featureImage}>This is the feature image...</div>
    <div className={styles.viewInLinks}>View in GB</div>

    <div className={styles.geneViewTabs}>
      <InfoButtonStrip />
    </div>
    <div className={styles.geneViewTable}>
      This is the Entity Viewer table...
    </div>
  </div>
);

export default GeneView;
