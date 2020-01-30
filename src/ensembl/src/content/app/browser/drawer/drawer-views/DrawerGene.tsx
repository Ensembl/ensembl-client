import React, { FunctionComponent } from 'react';

import { getDisplayStableId } from 'src/shared/state/ens-object/ensObjectHelpers';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

import styles from '../Drawer.scss';

type DrawerGeneProps = {
  ensObject: EnsObject;
};

const DrawerGene: FunctionComponent<DrawerGeneProps> = (
  props: DrawerGeneProps
) => {
  const { ensObject } = props;

  return (
    <div className={styles.drawerView}>
      <div className={styles.container}>
        <div className={styles.label}>Gene</div>
        <div className={styles.details}>
          <span className={styles.mainDetail}>{ensObject.label}</span>
        </div>

        <div className={styles.label}>Stable ID</div>
        <div className={styles.details}>{getDisplayStableId(ensObject)}</div>

        <div className={styles.label}>Description</div>
        <div className={styles.details}>{ensObject.description || '--'}</div>
      </div>
    </div>
  );
};

export default DrawerGene;
