import React, { FunctionComponent, Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { browserInfoConfig } from '../browserConfig';
import { TrackType } from '../track-panel/trackPanelConfig';

import { toggleBrowserNav, toggleGenomeSelector } from '../browserActions';
import { ChrLocation } from '../browserState';
import {
  getBrowserNavOpened,
  getChrLocation,
  getBrowserActivated,
  getDefaultChrLocation,
  getGenomeSelectorActive
} from '../browserSelectors';
import { getDrawerOpened } from '../drawer/drawerSelectors';
import { getEnsObjectInfo } from 'src/ens-object/ensObjectSelectors';
import {
  getSelectedBrowserTab,
  getTrackPanelModalOpened,
  getTrackPanelOpened
} from '../track-panel/trackPanelSelectors';
import { selectBrowserTab } from '../track-panel/trackPanelActions';
import { toggleDrawer } from '../drawer/drawerActions';
import { RootState } from 'src/store';

import BrowserReset from '../browser-reset/BrowserReset';
import BrowserGenomeSelector from '../browser-genome-selector/BrowserGenomeSelector';
import BrowserTabs from '../browser-tabs/BrowserTabs';

import styles from './BrowserBar.scss';

type StateProps = {
  browserActivated: boolean;
  browserNavOpened: boolean;
  chrLocation: ChrLocation;
  defaultChrLocation: ChrLocation;
  drawerOpened: boolean;
  genomeSelectorActive: boolean;
  ensObjectInfo: any;
  selectedBrowserTab: TrackType;
  trackPanelModalOpened: boolean;
  trackPanelOpened: boolean;
};

type DispatchProps = {
  selectBrowserTab: (selectedBrowserTab: TrackType) => void;
  toggleBrowserNav: () => void;
  toggleDrawer: (drawerOpened: boolean) => void;
  toggleGenomeSelector: (genomeSelectorActive: boolean) => void;
};

type OwnProps = {
  dispatchBrowserLocation: (chrLocation: ChrLocation) => void;
};

type BrowserBarProps = StateProps & DispatchProps & OwnProps;

export const BrowserBar: FunctionComponent<BrowserBarProps> = (
  props: BrowserBarProps
) => {
  const { navigator, reset } = browserInfoConfig;
  const { ensObjectInfo } = props;
  const [showBrowserInfo, toggleShowBrowserInfo] = useState(true);

  const changeBrowserInfoToggle = () => {
    const [, chrStart, chrEnd] = props.defaultChrLocation;

    if (
      props.genomeSelectorActive === true ||
      (chrStart === 0 && chrEnd === 0)
    ) {
      toggleShowBrowserInfo(false);
    } else {
      toggleShowBrowserInfo(true);
    }
  };

  useEffect(() => {
    changeBrowserInfoToggle();
  }, [props.defaultChrLocation]);

  useEffect(() => {
    changeBrowserInfoToggle();
  }, [props.genomeSelectorActive]);

  const getBrowserInfoClasses = () => {
    let classNames = styles.browserInfo;

    if (props.trackPanelOpened === false) {
      classNames += ` ${styles.browserInfoExpanded}`;
    }

    if (props.drawerOpened === true) {
      classNames += ` ${styles.browserInfoGreyed}`;
    }

    return classNames;
  };

  const getBrowserNavIcon = () => {
    if (props.drawerOpened === true) {
      return navigator.icon.grey;
    } else if (props.browserNavOpened === true) {
      return navigator.icon.selected;
    } else {
      return navigator.icon.default;
    }
  };

  const toggleNavigator = () => {
    if (props.drawerOpened === true) {
      return;
    }

    props.toggleBrowserNav();
  };

  return (
    <div className={styles.browserBar}>
      <div className={getBrowserInfoClasses()}>
        <dl className={styles.browserInfoLeft}>
          <BrowserReset
            dispatchBrowserLocation={props.dispatchBrowserLocation}
            chrLocation={props.chrLocation}
            defaultChrLocation={props.defaultChrLocation}
            details={reset}
            drawerOpened={props.drawerOpened}
          />
          {showBrowserInfo ? (
            <Fragment>
              <dd className={styles.geneSymbol}>
                <label>Gene</label>
                <span className={styles.value}>{ensObjectInfo.obj_symbol}</span>
              </dd>
              <dd>
                <label>Stable ID</label>
                <span className={styles.value}>{ensObjectInfo.stable_id}</span>
              </dd>
              <dd className="show-for-large">
                <label>Spliced mRNA length</label>
                <span className={styles.value}>
                  {ensObjectInfo.spliced_length}
                </span>
                <label>bp</label>
              </dd>
              <dd className={`show-for-large ${styles.nonLabelValue}`}>
                {ensObjectInfo.bio_type}
              </dd>
              <dd className={`show-for-large ${styles.nonLabelValue}`}>
                {ensObjectInfo.strand} strand
              </dd>
            </Fragment>
          ) : null}
        </dl>
        <dl className={styles.browserInfoRight}>
          <BrowserGenomeSelector
            browserActivated={props.browserActivated}
            dispatchBrowserLocation={props.dispatchBrowserLocation}
            defaultChrLocation={props.defaultChrLocation}
            drawerOpened={props.drawerOpened}
            genomeSelectorActive={props.genomeSelectorActive}
            toggleGenomeSelector={props.toggleGenomeSelector}
          />
          {props.genomeSelectorActive ? null : (
            <dd className={styles.navigator}>
              <button title={navigator.description} onClick={toggleNavigator}>
                <img src={getBrowserNavIcon()} alt={navigator.description} />
              </button>
            </dd>
          )}
        </dl>
      </div>
      {props.trackPanelOpened ? (
        <BrowserTabs
          drawerOpened={props.drawerOpened}
          genomeSelectorActive={props.genomeSelectorActive}
          selectBrowserTab={props.selectBrowserTab}
          selectedBrowserTab={props.selectedBrowserTab}
          toggleDrawer={props.toggleDrawer}
          trackPanelModalOpened={props.trackPanelModalOpened}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserActivated: getBrowserActivated(state),
  browserNavOpened: getBrowserNavOpened(state),
  chrLocation: getChrLocation(state),
  defaultChrLocation: getDefaultChrLocation(state),
  drawerOpened: getDrawerOpened(state),
  ensObjectInfo: getEnsObjectInfo(state),
  genomeSelectorActive: getGenomeSelectorActive(state),
  selectedBrowserTab: getSelectedBrowserTab(state),
  trackPanelModalOpened: getTrackPanelModalOpened(state),
  trackPanelOpened: getTrackPanelOpened(state)
});

const mapDispatchToProps: DispatchProps = {
  selectBrowserTab,
  toggleBrowserNav,
  toggleDrawer,
  toggleGenomeSelector
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserBar);
