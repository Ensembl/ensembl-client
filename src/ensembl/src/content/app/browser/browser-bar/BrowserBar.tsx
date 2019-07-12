import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { browserInfoConfig, BrowserInfoItem } from '../browserConfig';
import { TrackType } from '../track-panel/trackPanelConfig';

import { toggleBrowserNav, toggleGenomeSelector } from '../browserActions';
import { ChrLocation } from '../browserState';
import {
  getBrowserNavOpened,
  getChrLocation,
  getBrowserActivated,
  getDefaultChrLocation,
  getGenomeSelectorActive,
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject
} from '../browserSelectors';
import { getDrawerOpened } from '../drawer/drawerSelectors';
import {
  getSelectedBrowserTab,
  getTrackPanelModalOpened,
  getTrackPanelOpened
} from '../track-panel/trackPanelSelectors';
import { selectBrowserTabAndSave } from '../track-panel/trackPanelActions';
import { toggleDrawer } from '../drawer/drawerActions';
import { RootState } from 'src/store';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

import BrowserReset from '../browser-reset/BrowserReset';
import BrowserGenomeSelector from '../browser-genome-selector/BrowserGenomeSelector';
import BrowserTabs from '../browser-tabs/BrowserTabs';

import styles from './BrowserBar.scss';

type StateProps = {
  activeGenomeId: string | null;
  browserActivated: boolean;
  browserNavOpened: boolean;
  chrLocation: ChrLocation | null;
  defaultChrLocation: ChrLocation | null;
  drawerOpened: boolean;
  genomeSelectorActive: boolean;
  ensObject: EnsObject | null;
  selectedBrowserTab: { [genomeId: string]: TrackType };
  trackPanelModalOpened: boolean;
  trackPanelOpened: boolean;
};

type DispatchProps = {
  selectBrowserTabAndSave: (selectedBrowserTab: TrackType) => void;
  toggleBrowserNav: () => void;
  toggleDrawer: (drawerOpened: boolean) => void;
  toggleGenomeSelector: (genomeSelectorActive: boolean) => void;
};

type OwnProps = {
  dispatchBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
};

type BrowserBarProps = StateProps & DispatchProps & OwnProps;

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
    if (props.drawerOpened) {
      return navigator.icon.grey as string;
    } else if (props.browserNavOpened) {
      return navigator.icon.selected as string;
    } else {
      return navigator.icon.default;
    }
  };

  const toggleNavigator = () => {
    if (props.drawerOpened) {
      return;
    }

    props.toggleBrowserNav();
  };

  const className = classNames(styles.browserInfo, {
    [styles.browserInfoExpanded]: !props.trackPanelOpened,
    [styles.browserInfoGreyed]: props.drawerOpened
  });

  if (!(props.chrLocation && props.ensObject)) {
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
            drawerOpened={props.drawerOpened}
          />
          {showBrowserInfo && <BrowserInfo ensObject={props.ensObject} />}
        </dl>
        <dl className={styles.browserInfoRight}>
          <BrowserGenomeSelector
            activeGenomeId={props.activeGenomeId}
            browserActivated={props.browserActivated}
            dispatchBrowserLocation={props.dispatchBrowserLocation}
            chrLocation={props.chrLocation}
            drawerOpened={props.drawerOpened}
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
      {props.trackPanelOpened && props.activeGenomeId && (
        <BrowserTabs
          activeGenomeId={props.activeGenomeId}
          ensObject={props.ensObject}
          drawerOpened={props.drawerOpened}
          genomeSelectorActive={props.genomeSelectorActive}
          selectBrowserTabAndSave={props.selectBrowserTabAndSave}
          selectedBrowserTab={props.selectedBrowserTab}
          toggleDrawer={props.toggleDrawer}
          trackPanelModalOpened={props.trackPanelModalOpened}
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
            <span className={styles.value}>{ensObject.stable_id}</span>
          </dd>
          <dd className="show-for-large">
            <label>Spliced mRNA length</label>
            <span className={styles.value}>{ensObject.spliced_length}</span>
            <label>bp</label>
          </dd>
          <dd className={`show-for-large ${styles.nonLabelValue}`}>
            {ensObject.bio_type}
          </dd>
          <dd className={`show-for-large ${styles.nonLabelValue}`}>
            {ensObject.strand} strand
          </dd>
        </>
      )}

      {ensObject.object_type === 'region' && (
        <>
          <dd className={styles.ensObjectLabel}>
            <label>Region: </label>
            <span className={styles.value}>
              {`${ensObject.location.chromosome}:${ensObject.location.start}:${ensObject.location.end}`}
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
  defaultChrLocation: getDefaultChrLocation(state),
  drawerOpened: getDrawerOpened(state),
  ensObject: getBrowserActiveEnsObject(state),
  genomeSelectorActive: getGenomeSelectorActive(state),
  selectedBrowserTab: getSelectedBrowserTab(state),
  trackPanelModalOpened: getTrackPanelModalOpened(state),
  trackPanelOpened: getTrackPanelOpened(state)
});

const mapDispatchToProps: DispatchProps = {
  selectBrowserTabAndSave,
  toggleBrowserNav,
  toggleDrawer,
  toggleGenomeSelector
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserBar);
