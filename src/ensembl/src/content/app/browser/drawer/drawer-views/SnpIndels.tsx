import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

const SnpIndels: FunctionComponent = () => {
  return (
    <div className={styles.drawerView}>
      <div className={styles.clearFix}>
        <div className={styles.label}>Track name</div>
        <div className={styles.details}>1000 Genomes all SNPs &amp; indels</div>

        <div className={styles.label}>Description</div>
        <div className={styles.details}>
          The 1000 Genomes Project has found the most genetic variants (SNPs,
          CNVs, indels) with frequencies of at least 1% in the human populations
          studied.
        </div>
      </div>
    </div>
  );
};

export default SnpIndels;
