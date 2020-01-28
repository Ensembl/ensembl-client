import React from 'react';

import { GeneSummaryStrip, RegionSummaryStrip } from '../feature-summary-strip';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

type FeatureSummaryStripProps = {
  ensObject: EnsObject | null;
  isDrawerOpened: boolean;
};

export const FeatureSummaryStrip = (props: FeatureSummaryStripProps) => {
  const { ensObject, isDrawerOpened } = props;
  const childProps = {
    isGhosted: isDrawerOpened
  };
  if (!ensObject) {
    return null;
  }
  switch (ensObject.object_type) {
    case 'gene':
      return <GeneSummaryStrip gene={ensObject} {...childProps} />;
    case 'region':
      return <RegionSummaryStrip region={ensObject} {...childProps} />;
    default:
      return null;
  }
};

export default FeatureSummaryStrip;
