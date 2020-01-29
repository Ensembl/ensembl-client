import React from 'react';

import { GeneSummaryStrip, RegionSummaryStrip } from '../feature-summary-strip';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

export type FeatureSummaryStripProps = {
  ensObject: EnsObject;
  isGhosted: boolean;
};

export const FeatureSummaryStrip = (props: FeatureSummaryStripProps) => {
  const { ensObject, isGhosted } = props;

  switch (ensObject.object_type) {
    case 'gene':
      return <GeneSummaryStrip gene={ensObject} isGhosted={isGhosted} />;
    case 'region':
      return <RegionSummaryStrip region={ensObject} isGhosted={isGhosted} />;
    default:
      return null;
  }
};

export default FeatureSummaryStrip;
