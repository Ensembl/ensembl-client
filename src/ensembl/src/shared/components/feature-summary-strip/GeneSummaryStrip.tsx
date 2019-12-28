import React from 'react';
import classNames from 'classnames';

import { getDisplayStableId } from 'src/shared/state/ens-object/ensObjectHelpers';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';

import styles from './FeatureSummaryStrip.scss';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

type Props = {
  gene: EnsObject;
  isGhosted?: boolean;
};

const GeneSummaryStrip = ({ gene, isGhosted }: Props) => {
  const stripClasses = classNames(styles.featureSummaryStrip, {
    [styles.featureSummaryStripGhosted]: isGhosted
  });

  return (
    <div className={stripClasses}>
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
