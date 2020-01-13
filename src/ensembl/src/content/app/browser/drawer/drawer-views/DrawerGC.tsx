import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

const DrawerGC: FunctionComponent = () => {
  return (
    <div className={styles.drawerView}>
      <div className={styles.clearFix}>
        <div className={styles.label}>Track name</div>
        <div className={styles.details}>
          <p>%GC</p>
        </div>
      </div>

      <div className={styles.clearFix}>
        <div className={styles.label}>Description</div>
        <div className={styles.details}>
          <p>Shows the percentage of Gs and Cs in a region.</p>
        </div>
      </div>
    </div>
  );
};

export default DrawerGC;
