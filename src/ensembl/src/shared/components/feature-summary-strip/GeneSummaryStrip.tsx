import React from 'react';

import { getDisplayStableId } from 'src/shared/state/ens-object/ensObjectHelpers';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';

import styles from './FeatureSummaryStrip.scss';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

type Props = {
  gene: EnsObject;
};

const GeneSummaryStrip = ({ gene }: Props) => {
  return (
    <div className={styles.featureSummaryStrip}>
      <div>
        <span className={styles.featureSummaryStripLabel}>Gene</span>
        <span className={styles.featureDisplayName}>{gene.label}</span>
      </div>
      <div>
        <span className={styles.featureSummaryStripLabel}>Stable ID</span>
        <span>{getDisplayStableId(gene)}</span>
      </div>
      {gene.bio_type && <div>{gene.bio_type.toLowerCase()}</div>}
      <div>{gene.strand} strand</div>
      <div>{getFormattedLocation(gene.location)}</div>
    </div>
  );
};

export default GeneSummaryStrip;
