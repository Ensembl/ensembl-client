import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

const DrawerGC: FunctionComponent = () => {
  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Track name</label>
        <div className={styles.details}>
          <p>%GC</p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>
          <p>Shows the percentage of Gs and Cs in a region.</p>
        </div>
      </dd>
    </dl>
  );
};

export default DrawerGC;
