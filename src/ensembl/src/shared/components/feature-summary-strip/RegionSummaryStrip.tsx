import React from 'react';
import classNames from 'classnames';

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import styles from './FeatureSummaryStrip.scss';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

type Props = {
  region: EnsObject;
  isGhosted?: boolean;
};

const RegionSummaryStrip = ({ region, isGhosted }: Props) => {
  const stripClasses = classNames(styles.featureSummaryStrip, {
    [styles.featureSummaryStripGhosted]: isGhosted
  });
  return (
    <div className={stripClasses}>
      <span className={styles.featureSummaryStripLabel}>Region:</span>
      <span className={styles.featureDisplayName}>
        {getFormattedLocation(region.location)}
      </span>
    </div>
  );
};

export default RegionSummaryStrip;
