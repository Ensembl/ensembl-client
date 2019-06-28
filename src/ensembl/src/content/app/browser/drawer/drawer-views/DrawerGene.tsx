import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

type DrawerGeneProps = {
  ensObjectInfo: any;
};

const DrawerGene: FunctionComponent<DrawerGeneProps> = (
  props: DrawerGeneProps
) => {
  const { ensObjectInfo } = props;

  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Gene</label>
        <div className={styles.details}>
          <p>
            <span className={styles.mainDetail}>{ensObjectInfo.label}</span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Stable ID</label>
        <div className={styles.details}>
          <p>{ensObjectInfo.stable_id}</p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>{ensObjectInfo.description}</div>
      </dd>
    </dl>
  );
};

export default DrawerGene;
