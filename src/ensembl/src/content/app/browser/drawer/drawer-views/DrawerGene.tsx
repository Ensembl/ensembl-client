import React, { FunctionComponent } from 'react';

import { getDisplayStableId } from 'src/ens-object/ensObjectHelpers';

import { EnsObject } from 'src/ens-object/ensObjectTypes';

import styles from '../Drawer.scss';

type DrawerGeneProps = {
  ensObject: EnsObject;
};

const DrawerGene: FunctionComponent<DrawerGeneProps> = (
  props: DrawerGeneProps
) => {
  const { ensObject } = props;

  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Gene</label>
        <div className={styles.details}>
          <p>
            <span className={styles.mainDetail}>{ensObject.label}</span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Stable ID</label>
        <div className={styles.details}>
          <p>{getDisplayStableId(ensObject)}</p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>{ensObject.description || '--'}</div>
      </dd>
    </dl>
  );
};

export default DrawerGene;
