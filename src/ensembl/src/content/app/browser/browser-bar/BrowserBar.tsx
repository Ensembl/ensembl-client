import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { TrackSet } from '../track-panel/trackPanelConfig';
import { BreakpointWidth } from 'src/global/globalConfig';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

import { getDisplayStableId } from 'src/shared/state/ens-object/ensObjectHelpers';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';
import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

import { RootState } from 'src/store';
import { ChrLocation } from '../browserState';

import {
  getBrowserNavOpened,
  getChrLocation,
  getActualChrLocation,
  getDefaultChrLocation,
  getBrowserActivated,
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject,
  isFocusObjectPositionDefault
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
import TrackPanelTabs from '../track-panel/track-panel-tabs/TrackPanelTabs';

import styles from './BrowserBar.scss';

export type BrowserBarProps = {
  activeGenomeId: string | null;
  breakpointWidth: BreakpointWidth;
  browserActivated: boolean;
  browserNavOpened: boolean;
  chrLocation: ChrLocation | null;
  actualChrLocation: ChrLocation | null;
  defaultChrLocation: ChrLocation | null;
  isDrawerOpened: boolean;
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  ensObject: EnsObject | null;
  selectedTrackPanelTab: TrackSet;
  isFocusObjectInDefaultPosition: boolean;
  closeDrawer: () => void;
  selectTrackPanelTab: (selectedTrackPanelTab: TrackSet) => void;
  toggleBrowserNav: () => void;
  toggleTrackPanel: (isTrackPanelOpened: boolean) => void;
  changeFocusObject: (objectId: string) => void;
};

type BrowserInfoProps = {
  ensObject: EnsObject;
};

export const BrowserBar = (props: BrowserBarProps) => {
  const { isDrawerOpened } = props;

  const shouldShowBrowserInfo = () => {
    const { defaultChrLocation } = props;
    const isLocationOfWholeChromosome = !defaultChrLocation;

    return !isLocationOfWholeChromosome;
  };

  const [showBrowserInfo, toggleShowBrowserInfo] = useState(
    shouldShowBrowserInfo()
  );

  const setBrowserInfoVisibility = () => {
    const shouldToggleVisibility = showBrowserInfo !== shouldShowBrowserInfo();
    if (shouldToggleVisibility) {
      toggleShowBrowserInfo(!showBrowserInfo);
    }
  };

  useEffect(() => {
    setBrowserInfoVisibility();
  }, [props.defaultChrLocation]);

  const toggleNavigator = () => {
    if (isDrawerOpened) {
      return;
    }

    props.toggleBrowserNav();
  };

  const [chrCode, chrStart, chrEnd] = props.actualChrLocation || [];
  const shouldShowTrackPanelTabs =
    props.activeGenomeId &&
    (props.isTrackPanelOpened ||
      props.breakpointWidth === BreakpointWidth.DESKTOP);

  const browserInfoClassName = classNames(styles.browserInfo, {
    [styles.browserInfoExpanded]: !props.isTrackPanelOpened,
    [styles.browserInfoGreyed]: isDrawerOpened
  });

  const browserRegionClassName = classNames(styles.browserInfoRegion, {
    [styles.browserInfoHidden]: isDrawerOpened
  });

  if (!(props.chrLocation && props.actualChrLocation && props.ensObject)) {
    return <div className={styles.browserBar} />;
  }

  return (
    <div className={styles.browserBar}>
      <div className={browserInfoClassName}>
        <dl className={styles.browserInfoLeft}>
          <BrowserReset
            focusObject={props.ensObject}
            changeFocusObject={props.changeFocusObject}
            isActive={
              !props.isFocusObjectInDefaultPosition && !props.isDrawerOpened
            }
          />
          {showBrowserInfo && <BrowserInfo ensObject={props.ensObject} />}
        </dl>
        <dl className={styles.browserInfoRight}>
          {props.actualChrLocation && (
            <dd className={browserRegionClassName}>
              <div className={`${styles.chrLabel} show-for-large`}>
                Chromosome
              </div>
              <div className={styles.chrLocationView} onClick={toggleNavigator}>
                <div className={styles.chrCode}>{chrCode}</div>
                <div className={styles.chrRegion}>
                  <span>{getCommaSeparatedNumber(chrStart as number)}</span>
                  <span className={styles.chrSeparator}>-</span>
                  <span>{getCommaSeparatedNumber(chrEnd as number)}</span>
                </div>
              </div>
            </dd>
          )}
        </dl>
      </div>
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
    </div>
  );
};

export const BrowserInfo = ({ ensObject }: BrowserInfoProps) => {
  return (
    <>
      {ensObject.object_type === 'gene' && (
        <>
          <dd className={styles.ensObjectLabel}>
            <label>{ensObject.object_type}</label>
            <span className={styles.value}>{ensObject.label}</span>
          </dd>
          <dd>
            <label>Stable ID</label>
            <span className={styles.value}>
              {getDisplayStableId(ensObject)}
            </span>
          </dd>
          <dd className={`show-for-large`}>
            {ensObject.bio_type && ensObject.bio_type.toLowerCase()}
          </dd>
          <dd className={`show-for-large`}>{ensObject.strand} strand</dd>
          <dd className={`show-for-large`}>
            {getFormattedLocation(ensObject.location)}
          </dd>
        </>
      )}

      {ensObject.object_type === 'region' && (
        <>
          <dd className={styles.ensObjectLabel}>
            <label>Region: </label>
            <span className={styles.value}>
              {getFormattedLocation(ensObject.location)}
            </span>
          </dd>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  breakpointWidth: getBreakpointWidth(state),
  browserActivated: getBrowserActivated(state),
  browserNavOpened: getBrowserNavOpened(state),
  chrLocation: getChrLocation(state),
  actualChrLocation: getActualChrLocation(state),
  defaultChrLocation: getDefaultChrLocation(state),
  ensObject: getBrowserActiveEnsObject(state),
  isDrawerOpened: getIsDrawerOpened(state),
  isTrackPanelModalOpened: getIsTrackPanelModalOpened(state),
  isTrackPanelOpened: getIsTrackPanelOpened(state),
  selectedTrackPanelTab: getSelectedTrackPanelTab(state),
  isFocusObjectInDefaultPosition: isFocusObjectPositionDefault(state)
});

const mapDispatchToProps = {
  closeDrawer,
  selectTrackPanelTab,
  toggleBrowserNav,
  toggleTrackPanel,
  changeFocusObject
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserBar);
