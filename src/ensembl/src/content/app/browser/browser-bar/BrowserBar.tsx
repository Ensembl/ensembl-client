import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { browserInfoConfig, BrowserInfoItem } from '../browserConfig';
import { TrackType } from '../track-panel/trackPanelConfig';

import { getDisplayStableId } from 'src/ens-object/ensObjectHelpers';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';

import { toggleBrowserNav, toggleGenomeSelector } from '../browserActions';
import { ChrLocation } from '../browserState';
import {
  getBrowserNavOpened,
  getChrLocation,
  getActualChrLocation,
  getDefaultChrLocation,
  getBrowserActivated,
  getGenomeSelectorActive,
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject
} from '../browserSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';
import {
  getSelectedBrowserTab,
  getIsTrackPanelModalOpened,
  getIsTrackPanelOpened
} from '../track-panel/trackPanelSelectors';
import { selectBrowserTabAndSave } from '../track-panel/trackPanelActions';
import { closeDrawer, toggleDrawer } from '../drawer/drawerActions';
import { RootState } from 'src/store';
import { EnsObject, EnsObjectLocation } from 'src/ens-object/ensObjectTypes';

import BrowserReset from '../browser-reset/BrowserReset';
import BrowserGenomeSelector from '../browser-genome-selector/BrowserGenomeSelector';
import BrowserTabs from '../browser-tabs/BrowserTabs';

import styles from './BrowserBar.scss';

type StateProps = {
  activeGenomeId: string | null;
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
  selectedBrowserTab: TrackType;
};

type DispatchProps = {
  closeDrawer: () => void;
  selectBrowserTabAndSave: (selectedBrowserTab: TrackType) => void;
  toggleBrowserNav: () => void;
  toggleDrawer: (isDrawerOpened: boolean) => void;
  toggleGenomeSelector: (genomeSelectorActive: boolean) => void;
};

type OwnProps = {
  dispatchBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
};

export type BrowserBarProps = StateProps & DispatchProps & OwnProps;

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
            activeGenomeId={props.activeGenomeId}
            dispatchBrowserLocation={props.dispatchBrowserLocation}
            chrLocation={props.chrLocation}
            defaultChrLocation={props.defaultChrLocation}
            isDrawerOpened={isDrawerOpened}
          />
          {showBrowserInfo && <BrowserInfo ensObject={props.ensObject} />}
        </dl>
        <dl className={styles.browserInfoRight}>
          <BrowserGenomeSelector
            activeGenomeId={props.activeGenomeId}
            browserActivated={props.browserActivated}
            dispatchBrowserLocation={props.dispatchBrowserLocation}
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
      {props.isTrackPanelOpened && props.activeGenomeId && (
        <BrowserTabs
          closeDrawer={props.closeDrawer}
          ensObject={props.ensObject}
          isDrawerOpened={props.isDrawerOpened}
          genomeSelectorActive={props.genomeSelectorActive}
          selectBrowserTabAndSave={props.selectBrowserTabAndSave}
          selectedBrowserTab={props.selectedBrowserTab}
          isTrackPanelModalOpened={props.isTrackPanelModalOpened}
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
          <dd className={`show-for-large ${styles.nonLabelValue}`}>
            {ensObject.bio_type}
          </dd>
          <dd className={`show-for-large ${styles.nonLabelValue}`}>
            {ensObject.strand} strand
          </dd>
          <dd className={`show-for-large ${styles.nonLabelValue}`}>
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

const mapStateToProps = (state: RootState): StateProps => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
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
  selectedBrowserTab: getSelectedBrowserTab(state)
});

const mapDispatchToProps: DispatchProps = {
  closeDrawer,
  selectBrowserTabAndSave,
  toggleBrowserNav,
  toggleDrawer,
  toggleGenomeSelector
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserBar);
