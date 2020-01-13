import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

const DrawerContigs: FunctionComponent = () => {
  return (
    <div className={styles.drawerView}>
      <div className={styles.clearFix}>
        <div className={styles.label}>Track name</div>
        <div className={styles.details}>
          <p>Contigs</p>
        </div>
      </div>

      <div className={styles.clearFix}>
        <div className={styles.label}>Description</div>
        <div className={styles.details}>
          <p>
            Shows a contiguous stretch of DNA sequence without gaps that has
            been assembled solely based on direct sequencing information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrawerContigs;
