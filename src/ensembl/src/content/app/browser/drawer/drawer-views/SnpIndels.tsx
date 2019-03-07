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
          <p>Shows all SNPs and indels in 1000 Genomes</p>
        </div>
      </dd>
    </dl>
  );
};

export default SnpIndels;
