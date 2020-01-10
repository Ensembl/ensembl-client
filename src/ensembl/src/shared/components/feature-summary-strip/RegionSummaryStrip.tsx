import React from 'react';

import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';

import styles from './FeatureSummaryStrip.scss';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

type Props = {
  region: EnsObject;
};

const RegionSummaryStrip = ({ region }: Props) => {
  return (
    <div className={styles.featureSummaryStrip}>
      <span className={styles.featureSummaryStripLabel}>Region:</span>
      <span className={styles.featureDisplayName}>
        {getFormattedLocation(region.location)}
      </span>
    </div>
  );
};

export default RegionSummaryStrip;
