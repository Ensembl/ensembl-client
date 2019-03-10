import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

type DrawerGeneProps = {
  objectInfo: any;
};

const DrawerGene: FunctionComponent<DrawerGeneProps> = (
  props: DrawerGeneProps
) => {
  const { objectInfo } = props;

  let geneSymbol = objectInfo.obj_symbol;
  let geneStableId = objectInfo.stable_id;

  if (objectInfo.obj_type === 'transcript') {
    geneSymbol = objectInfo.associated_object.obj_symbol;
    geneStableId = objectInfo.associated_object.stable_id;
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
