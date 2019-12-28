import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { TrackSet } from '../track-panel/trackPanelConfig';
import { BreakpointWidth } from 'src/global/globalConfig';

import {
  getBrowserNavOpened,
  getChrLocation,
  getDefaultChrLocation,
  getBrowserActivated,
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject
} from '../browserSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';
import {
  getSelectedTrackPanelTab,
  getIsTrackPanelModalOpened,
  getIsTrackPanelOpened
} from '../track-panel/trackPanelSelectors';
import { getBreakpointWidth } from 'src/global/globalSelectors';

import { toggleBrowserNav, changeFocusObject } from '../browserActions';
import {
  selectTrackPanelTab,
  toggleTrackPanel
} from '../track-panel/trackPanelActions';
import { closeDrawer } from '../drawer/drawerActions';

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
  // activeGenomeId: string | null;
  // breakpointWidth: BreakpointWidth;
  // browserActivated: boolean;
  // browserNavOpened: boolean;
  chrLocation: ChrLocation | null;
  defaultChrLocation: ChrLocation | null;
  // isDrawerOpened: boolean;
  // isTrackPanelModalOpened: boolean;
  // isTrackPanelOpened: boolean;
  ensObject: EnsObject | null;
  // selectedTrackPanelTab: TrackSet;
  isFocusObjectInDefaultPosition: boolean;
  // closeDrawer: () => void;
  // selectTrackPanelTab: (selectedTrackPanelTab: TrackSet) => void;
  toggleBrowserNav: () => void;
  // toggleTrackPanel: (isTrackPanelOpened: boolean) => void;
  // changeFocusObject: (objectId: string) => void;
};

type BrowserInfoProps = {
  ensObject: EnsObject;
};

export const BrowserBar = (props: BrowserBarProps) => {
  const shouldShowBrowserInfo = () => {
    const { defaultChrLocation } = props;
    const isLocationOfWholeChromosome = !defaultChrLocation;

    return !isLocationOfWholeChromosome;
  };

  const browserInfoClassName = classNames(styles.browserInfo, {
    // [styles.browserInfoGreyed]: isDrawerOpened
  });

  // const browserRegionClassName = classNames(styles.browserInfoRegion, {
  //   [styles.browserInfoHidden]: isDrawerOpened
  // });

  if (!(props.chrLocation && props.ensObject)) {
    return <div />;
  }

  return (
    <div className={styles.browserBar}>
      <div className={styles.browserResetWrapper}>
        <BrowserReset />
      </div>
      <BrowserInfo ensObject={props.ensObject} />
      <div className={styles.browserLocationIndicatorWrapper}>
        <BrowserLocationIndicator />
      </div>
    </div>
  );
};

/*

{shouldShowTrackPanelTabs && (
  <TrackPanelTabs
    closeDrawer={props.closeDrawer}
    ensObject={props.ensObject}
    isDrawerOpened={props.isDrawerOpened}
    selectTrackPanelTab={props.selectTrackPanelTab}
    selectedTrackPanelTab={props.selectedTrackPanelTab}
    toggleTrackPanel={props.toggleTrackPanel}
    isTrackPanelModalOpened={props.isTrackPanelModalOpened}
    isTrackPanelOpened={props.isTrackPanelOpened}
  />
)}

*/

export const BrowserInfo = ({ ensObject }: BrowserInfoProps) => {
  switch (ensObject.object_type) {
    case 'gene':
      return <GeneSummaryStrip gene={ensObject} />;
    case 'region':
      return <RegionSummaryStrip region={ensObject} />;
    default:
      return null;
  }
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  breakpointWidth: getBreakpointWidth(state),
  browserActivated: getBrowserActivated(state),
  browserNavOpened: getBrowserNavOpened(state),
  chrLocation: getChrLocation(state),
  defaultChrLocation: getDefaultChrLocation(state),
  ensObject: getBrowserActiveEnsObject(state),
  isDrawerOpened: getIsDrawerOpened(state),
  isTrackPanelModalOpened: getIsTrackPanelModalOpened(state),
  isTrackPanelOpened: getIsTrackPanelOpened(state),
  selectedTrackPanelTab: getSelectedTrackPanelTab(state)
});

const mapDispatchToProps = {
  closeDrawer,
  selectTrackPanelTab,
  toggleBrowserNav,
  toggleTrackPanel,
  changeFocusObject
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowserBar);
