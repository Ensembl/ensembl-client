import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { browserInfoConfig, BrowserInfoItem } from '../browserConfig';
import { TrackSet } from '../track-panel/trackPanelConfig';

import { getDisplayStableId } from 'src/ens-object/ensObjectHelpers';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';

import {
  toggleBrowserNav,
  toggleGenomeSelector,
  changeFocusObject
} from '../browserActions';
import { ChrLocation } from '../browserState';
import {
  getBrowserNavOpened,
  getChrLocation,
  getActualChrLocation,
  getDefaultChrLocation,
  getBrowserActivated,
  getGenomeSelectorActive,
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
import {
  selectTrackPanelTab,
  toggleTrackPanel
} from '../track-panel/trackPanelActions';
import { closeDrawer } from '../drawer/drawerActions';
import { RootState } from 'src/store';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

import BrowserReset from '../browser-reset/BrowserReset';
import BrowserGenomeSelector from '../browser-genome-selector/BrowserGenomeSelector';
import TrackPanelTabs from '../track-panel/track-panel-tabs/TrackPanelTabs';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import { BreakpointWidth } from 'src/global/globalConfig';

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
  genomeSelectorActive: boolean;
  ensObject: EnsObject | null;
  selectedTrackPanelTab: TrackSet;
  isFocusObjectInDefaultPosition: boolean;
  closeDrawer: () => void;
  selectTrackPanelTab: (selectedTrackPanelTab: TrackSet) => void;
  toggleBrowserNav: () => void;
  toggleGenomeSelector: (genomeSelectorActive: boolean) => void;
  toggleTrackPanel: (isTrackPanelOpened: boolean) => void;
  changeFocusObject: (objectId: string) => void;
};

type BrowserInfoProps = {
  ensObject: EnsObject;
};

type BrowserNavigatorButtonProps = {
  toggleNavigator: () => void;
  navigator: BrowserInfoItem;
  icon: string; // TODO: use inline SVG
};

export const BrowserBar: FunctionComponent<BrowserBarProps> = (
  props: BrowserBarProps
) => {
  const { isDrawerOpened } = props;

  const shouldShowBrowserInfo = () => {
    const { defaultChrLocation } = props;
    const isLocationOfWholeChromosome = !defaultChrLocation;

    return !(props.genomeSelectorActive || isLocationOfWholeChromosome);
  };

  const { navigator } = browserInfoConfig;
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
  }, [props.defaultChrLocation, props.genomeSelectorActive]);

  const getBrowserNavIcon = () => {
    if (isDrawerOpened) {
      return navigator.icon.grey as string;
    } else if (props.browserNavOpened) {
      return navigator.icon.selected as string;
    } else {
      return navigator.icon.default;
    }
  };

  const toggleNavigator = () => {
    if (isDrawerOpened) {
      return;
    }

    props.toggleBrowserNav();
  };

  const shouldShowTrackPanelTabs =
    props.activeGenomeId &&
    (props.isTrackPanelOpened ||
      props.breakpointWidth === BreakpointWidth.DESKTOP);

  const className = classNames(styles.browserInfo, {
    [styles.browserInfoExpanded]: !props.isTrackPanelOpened,
    [styles.browserInfoGreyed]: isDrawerOpened
  });

  if (!(props.chrLocation && props.actualChrLocation && props.ensObject)) {
    return <div className={styles.browserBar} />;
  }

  return (
    <div className={styles.browserBar}>
      <div className={className}>
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
          <BrowserGenomeSelector
            activeGenomeId={props.activeGenomeId}
            browserActivated={props.browserActivated}
            chrLocation={props.actualChrLocation}
            isDrawerOpened={isDrawerOpened}
            genomeSelectorActive={props.genomeSelectorActive}
            toggleGenomeSelector={props.toggleGenomeSelector}
          />
          {!props.genomeSelectorActive && props.ensObject.genome_id && (
            <BrowserNavigatorButton
              navigator={navigator}
              toggleNavigator={toggleNavigator}
              icon={getBrowserNavIcon()}
            />
          )}
        </dl>
      </div>
      {shouldShowTrackPanelTabs && (
        <TrackPanelTabs
          closeDrawer={props.closeDrawer}
          ensObject={props.ensObject}
          isDrawerOpened={props.isDrawerOpened}
          genomeSelectorActive={props.genomeSelectorActive}
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
  genomeSelectorActive: getGenomeSelectorActive(state),
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
  toggleGenomeSelector,
  toggleTrackPanel,
  changeFocusObject
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserBar);
