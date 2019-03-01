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
    <dl className={styles.drawerView}>
      <dd className="clearfix">
        <label htmlFor="">Track name</label>
        <div className={styles.details}>
          <p>Other genes</p>
        </div>
      </dd>

      <dd className="clearfix">
        <label htmlFor="">Description</label>
        <div className={styles.details}>
          <p>
            Shows all non-coding genes on the{' '}
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

export default OtherGenes;
