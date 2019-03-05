import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

const DrawerContigs: FunctionComponent = () => {
  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Track name</label>
        <div className={styles.details}>
          <p>Contigs</p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>
          <p>
            Shows a contiguous stretch of DNA sequence without gaps that has
            been assembled solely based on direct sequencing information.
          </p>
        </div>
      </dd>
    </dl>
  );
};

export default DrawerContigs;
