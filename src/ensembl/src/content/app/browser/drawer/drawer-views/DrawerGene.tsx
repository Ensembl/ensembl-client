import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

type DrawerGeneProps = {
  ensObjectInfo: any;
};

const DrawerGene: FunctionComponent<DrawerGeneProps> = (
  props: DrawerGeneProps
) => {
  const { ensObjectInfo } = props;

  let geneSymbol = ensObjectInfo.label;
  let geneStableId = ensObjectInfo.stable_id;

  if (ensObjectInfo.obj_type === 'transcript') {
    geneSymbol = ensObjectInfo.associated_object.label;
    geneStableId = ensObjectInfo.associated_object.stable_id;
  }

  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Gene</label>
        <div className={styles.details}>
          <p>
            <span className={styles.mainDetail}>{geneSymbol}</span>
          </p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Stable ID</label>
        <div className={styles.details}>
          <p>{geneStableId}</p>
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
