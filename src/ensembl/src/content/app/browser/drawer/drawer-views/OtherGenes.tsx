import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

type OtherGenesProps = {
  forwardStrand: boolean;
};

const OtherGenes: FunctionComponent<OtherGenesProps> = (
  props: OtherGenesProps
) => {
  const { forwardStrand } = props;

  return (
    <div className={styles.drawerView}>
      <div className={styles.container}>
        <div className={styles.label}>Track name</div>
        <div className={styles.details}>Other genes</div>

        <div className={styles.label}>Description</div>
        <div className={styles.details}>
          <p>
            <span className={styles.nextLine}>
              Shows all non-coding genes on the{' '}
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

export default OtherGenes;
