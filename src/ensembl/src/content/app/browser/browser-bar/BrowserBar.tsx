import React from 'react';
import { connect } from 'react-redux';

import {
  getChrLocation,
  getDefaultChrLocation,
  getBrowserActiveEnsObject
} from '../browserSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';

import BrowserReset from '../browser-reset/BrowserReset';
import {
  GeneSummaryStrip,
  RegionSummaryStrip
} from 'src/shared/components/feature-summary-strip';
import BrowserLocationIndicator from '../browser-location-indicator/BrowserLocationIndicator';

import { RootState } from 'src/store';
import { ChrLocation } from '../browserState';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

import styles from './BrowserBar.scss';

export type BrowserBarProps = {
  chrLocation: ChrLocation | null;
  defaultChrLocation: ChrLocation | null;
  isDrawerOpened: boolean;
  ensObject: EnsObject | null;
};

type BrowserInfoProps = {
  ensObject: EnsObject;
  isDrawerOpened: boolean;
};

export const BrowserBar = (props: BrowserBarProps) => {
  // FIXME: is this still necessary for anything?
  // const shouldShowBrowserInfo = () => {
  //   const { defaultChrLocation } = props;
  //   const isLocationOfWholeChromosome = !defaultChrLocation;
  //
  //   return !isLocationOfWholeChromosome;
  // };

  // return empty div instead of null, so that the dedicated slot in the CSS grid of StandardAppLayout
  // always contains a child DOM element
  if (!(props.chrLocation && props.ensObject)) {
    return <div />;
  }

  return (
    <div className={styles.browserBar}>
      <div className={styles.browserResetWrapper}>
        <BrowserReset />
      </div>
      <BrowserInfo
        ensObject={props.ensObject}
        isDrawerOpened={props.isDrawerOpened}
      />
      <div className={styles.browserLocationIndicatorWrapper}>
        <BrowserLocationIndicator />
      </div>
    </div>
  );
};

export const BrowserInfo = (props: BrowserInfoProps) => {
  const { ensObject, isDrawerOpened } = props;
  const childProps = {
    isGhosted: isDrawerOpened
  };
  switch (ensObject.object_type) {
    case 'gene':
      return <GeneSummaryStrip gene={ensObject} {...childProps} />;
    case 'region':
      return <RegionSummaryStrip region={ensObject} {...childProps} />;
    default:
      return null;
  }
};

const mapStateToProps = (state: RootState) => ({
  chrLocation: getChrLocation(state),
  defaultChrLocation: getDefaultChrLocation(state),
  ensObject: getBrowserActiveEnsObject(state),
  isDrawerOpened: getIsDrawerOpened(state)
});

export default connect(mapStateToProps)(BrowserBar);
