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
    <div className={styles.drawerView}>
      <div className={styles.clearFix}>
        <div className={styles.label}>Track name</div>
        <div className={styles.details}>
          <p>Protein coding genes</p>
        </div>

        <div className={styles.label}>Description</div>
        <div className={styles.details}>
          <p>
            <span className={styles.nextLine}>
              Shows all protein coding genes on the{' '}
              {forwardStrand ? 'forward' : 'reverse'} strand of this chromosome.
              Part of the GENCODE comprehensive gene set.
            </span>
            <a href="https://www.gencodegenes.org">
              https://www.gencodegenes.org/
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProteinCodingGenes;
