import React from 'react';
import { connect } from 'react-redux';

import {
  getChrLocation,
  getDefaultChrLocation,
  getBrowserActiveEnsObject
} from '../browserSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';

import BrowserReset from '../browser-reset/BrowserReset';
import FeatureSummaryStrip from 'src/shared/components/feature-summary-strip/FeatureSummaryStrip';
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

export const BrowserBar = (props: BrowserBarProps) => {
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
      {props.ensObject ? (
        <FeatureSummaryStrip
          ensObject={props.ensObject}
          isGhosted={props.isDrawerOpened}
        />
      ) : null}
      <div className={styles.browserLocationIndicatorWrapper}>
        <BrowserLocationIndicator />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  chrLocation: getChrLocation(state),
  defaultChrLocation: getDefaultChrLocation(state),
  ensObject: getBrowserActiveEnsObject(state),
  isDrawerOpened: getIsDrawerOpened(state)
});

export default connect(mapStateToProps)(BrowserBar);
