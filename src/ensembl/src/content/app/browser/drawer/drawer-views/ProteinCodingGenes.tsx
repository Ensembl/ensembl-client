import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

type ProteinCodingGenesProps = {
  forwardStrand: boolean;
};

const ProteinCodingGenes: FunctionComponent<ProteinCodingGenesProps> = (
  props: ProteinCodingGenesProps
) => {
  const { forwardStrand } = props;

  return (
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Track name</label>
        <div className={styles.details}>
          <p>Protein coding genes</p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>
          <p>
            Shows all protein coding genes on the{' '}
            {forwardStrand ? 'forward' : 'reverse'} strand of this chromosome.
            Part of the GENCODE comprehensive gene set.
          </p>
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

export default ProteinCodingGenes;
