import React from 'react';

import styles from './GeneView.scss';

const GeneView = () => (
  <div className={styles.geneView}>
    <div className={styles.featureImage}>This is the feature image...</div>
    <div className={styles.viewInLinks}>View in GB</div>

    <div className={styles.geneViewTabs}>
      These are the Entity Viewer tabs...
    </div>
    <div className={styles.geneViewTable}>
      This is the Entity Viewer table...
    </div>
  </div>
);

export default GeneView;
