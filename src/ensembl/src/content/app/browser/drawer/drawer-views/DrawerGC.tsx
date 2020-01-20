import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

const DrawerGC: FunctionComponent = () => {
  return (
    <div className={styles.drawerView}>
      <div className={styles.container}>
        <div className={styles.label}>Track name</div>
        <div className={styles.details}>%GC</div>

        <div className={styles.label}>Description</div>
        <div className={styles.details}>
          Shows the percentage of Gs and Cs in a region.
        </div>
      </div>
    </div>
  );
};

export default DrawerGC;
