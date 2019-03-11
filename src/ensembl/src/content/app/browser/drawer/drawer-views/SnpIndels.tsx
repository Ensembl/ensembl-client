import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

const SnpIndels: FunctionComponent = () => {
  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Track name</label>
        <div className={styles.details}>
          <p>1000 Genomes all SNPs &amp; indels</p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>
          <p>
            The 1000 Genomes Project has found the most genetic variants (SNPs,
            CNVs, indels) with frequencies of at least 1% in the human
            populations studied.
          </p>
        </div>
      </dd>
    </dl>
  );
};

export default SnpIndels;
