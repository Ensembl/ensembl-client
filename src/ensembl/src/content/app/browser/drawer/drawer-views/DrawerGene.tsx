import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

const DrawerGene: FunctionComponent = () => {
  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Gene</label>
        <div className={styles.details}>
          <p>
            <span className={styles.mainDetail}>BRCA2</span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Stable ID</label>
        <div className={styles.details}>
          <p>ENSG00000139618</p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>
          <p>DNA repair associated</p>
          <p>This gene is part of the GENCODE Comprehensive gene set</p>
          <p>
            <a href="https://www.gencodegenes.org">
              https://www.gencodegenes.org/
            </a>
          </p>
        </div>
      </dd>
    </dl>
  );
};

export default DrawerGene;
