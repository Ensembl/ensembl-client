import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { BrowserInfoItem } from '../browserConfig';
import { TrackSet } from '../track-panel/trackPanelConfig';

import { getDisplayStableId } from 'src/ens-object/ensObjectHelpers';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';

import { toggleBrowserNav } from '../browserActions';
import { ChrLocation } from '../browserState';
import {
  getBrowserNavOpened,
  getChrLocation,
  getActualChrLocation,
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
import {
  selectTrackPanelTabAndSave,
  toggleTrackPanel
} from '../track-panel/trackPanelActions';
import { closeDrawer } from '../drawer/drawerActions';
import { RootState } from 'src/store';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

import BrowserReset from '../browser-reset/BrowserReset';
import TrackPanelTabs from '../track-panel/track-panel-tabs/TrackPanelTabs';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import { BreakpointWidth } from 'src/global/globalConfig';

import styles from './BrowserBar.scss';
import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

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
  closeDrawer: () => void;
  selectTrackPanelTabAndSave: (selectedTrackPanelTab: TrackSet) => void;
  toggleBrowserNav: () => void;
  toggleTrackPanel: (isTrackPanelOpened: boolean) => void;
  dispatchBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
};

type BrowserInfoProps = {
  ensObject: EnsObject;
};

type BrowserNavigatorButtonProps = {
  toggleNavigator: () => void;
  navigator: BrowserInfoItem;
  icon: string; // TODO: use inline SVG
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

  const [chrCode, chrStart, chrEnd] = props.actualChrLocation || [, , ,];
  const displayChrRegion = !(chrStart === 0 && chrEnd === 0);

  const shouldShowTrackPanelTabs =
    props.activeGenomeId &&
    (props.isTrackPanelOpened ||
      props.breakpointWidth === BreakpointWidth.LARGE);

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
            activeGenomeId={props.activeGenomeId}
            dispatchBrowserLocation={props.dispatchBrowserLocation}
            chrLocation={props.chrLocation}
            defaultChrLocation={props.defaultChrLocation}
            isDrawerOpened={isDrawerOpened}
          />
          {showBrowserInfo && <BrowserInfo ensObject={props.ensObject} />}
        </dl>
        <dl className={styles.browserInfoRight}>
          {props.actualChrLocation && (
            <dd className={browserRegionClassName}>
              <label className="show-for-large">Chromosome</label>
              <div className={styles.chrLocationView} onClick={toggleNavigator}>
                <div className={styles.chrCode}>{chrCode}</div>
                {displayChrRegion ? (
                  <div className={styles.chrRegion}>
                    <span>{getCommaSeparatedNumber(chrStart as number)}</span>
                    <span className={styles.chrSeparator}> - </span>
                    <span>{getCommaSeparatedNumber(chrEnd as number)}</span>
                  </div>
                ) : null}
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
          selectTrackPanelTabAndSave={props.selectTrackPanelTabAndSave}
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

export const BrowserNavigatorButton = (props: BrowserNavigatorButtonProps) => (
  <dd className={styles.navigator}>
    <button title={props.navigator.description} onClick={props.toggleNavigator}>
      <img src={props.icon} alt={props.navigator.description} />
    </button>
  </dd>
);

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
  selectedTrackPanelTab: getSelectedTrackPanelTab(state)
});

const mapDispatchToProps = {
  closeDrawer,
  selectTrackPanelTabAndSave,
  toggleBrowserNav,
  toggleTrackPanel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserBar);
