import React from 'react';

import styles from './EntityViewerContent.scss';

const EntityViewerContent = () => (
  <div className={styles.entityViewerContent}>
    <div className={styles.featureImage}>This is the feature image...</div>
    <div className={styles.viewInLinks}>View in GB</div>

    <div className={styles.entityViewerTabs}>These are the EV tabs...</div>
    <div className={styles.entityViewerTable}>This is the EV table...</div>
  </div>
);

export default EntityViewerContent;
