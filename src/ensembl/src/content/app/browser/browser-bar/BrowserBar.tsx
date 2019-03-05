import React, { FunctionComponent, Fragment } from 'react';
import { connect } from 'react-redux';

import { browserInfoConfig } from '../browserConfig';
import {
  toggleBrowserNav,
  updateDefaultChrLocation,
  updateChrLocation,
  toggleGenomeSelector
} from '../browserActions';
import { ChrLocation } from '../browserState';
import {
  getBrowserNavOpened,
  getChrLocation,
  getBrowserActivated,
  getDefaultChrLocation,
  getGenomeSelectorActive,
  getDrawerOpened
} from '../browserSelectors';
import { RootState } from 'src/rootReducer';

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
};

type DispatchProps = {
  toggleBrowserNav: () => void;
  toggleGenomeSelector: (genomeSelectorActive: boolean) => void;
  updateChrLocation: (chrLocation: ChrLocation) => void;
  updateDefaultChrLocation: (chrLocation: ChrLocation) => void;
};

type OwnProps = {
  changeBrowserLocation: () => void;
};

type BrowserBarProps = StateProps & DispatchProps & OwnProps;

export const BrowserBar: FunctionComponent<BrowserBarProps> = (
  props: BrowserBarProps
) => {
  const { navigator, reset } = browserInfoConfig;

  const getBrowserInfoClasses = () => {
    let classNames = styles.browserInfo;

    if (props.drawerOpened === true) {
      classNames += ` ${styles.browserInfoGreyed}`;
    }

    return classNames;
  };

  const getBrowserNavIcon = () => {
    if (props.browserNavOpened === true) {
      return navigator.icon.selected;
    } else {
      return navigator.icon.default;
    }
  };

  return (
    <div className={styles.browserBar}>
      <div className={getBrowserInfoClasses()}>
        <dl className={styles.browserInfoLeft}>
          <BrowserReset
            changeBrowserLocation={props.changeBrowserLocation}
            chrLocation={props.chrLocation}
            defaultChrLocation={props.defaultChrLocation}
            details={reset}
            drawerOpened={props.drawerOpened}
            updateChrLocation={props.updateChrLocation}
          />
          {props.genomeSelectorActive ? null : (
            <Fragment>
              <dd className={styles.geneSymbol}>
                <label>Gene</label>
                <span className={styles.value}>BRAC2</span>
              </dd>
              <dd>
                <label>Stable ID</label>
                <span className={styles.value}>ENSG00000139618</span>
              </dd>
              <dd className="show-for-large">
                <label>Spliced mRNA length</label>
                <span className={styles.value}>84,793</span>
                <label>bp</label>
              </dd>
              <dd className={`show-for-large ${styles.nonLabelValue}`}>
                protein coding
              </dd>
              <dd className={`show-for-large ${styles.nonLabelValue}`}>
                forward strand
              </dd>
            </Fragment>
          )}
        </dl>
        <dl className={styles.browserInfoRight}>
          <BrowserGenomeSelector
            browserActivated={props.browserActivated}
            changeBrowserLocation={props.changeBrowserLocation}
            defaultChrLocation={props.defaultChrLocation}
            drawerOpened={props.drawerOpened}
            genomeSelectorActive={props.genomeSelectorActive}
            toggleGenomeSelector={props.toggleGenomeSelector}
            updateDefaultChrLocation={props.updateDefaultChrLocation}
          />
          {props.genomeSelectorActive ? null : (
            <dd className={styles.navigator}>
              <button
                title={navigator.description}
                onClick={props.toggleBrowserNav}
              >
                <img src={getBrowserNavIcon()} alt={navigator.description} />
              </button>
            </dd>
          )}
        </dl>
      </div>
      <BrowserTabs />
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserActivated: getBrowserActivated(state),
  browserNavOpened: getBrowserNavOpened(state),
  chrLocation: getChrLocation(state),
  defaultChrLocation: getDefaultChrLocation(state),
  drawerOpened: getDrawerOpened(state),
  genomeSelectorActive: getGenomeSelectorActive(state)
});

const mapDispatchToProps: DispatchProps = {
  toggleBrowserNav,
  toggleGenomeSelector,
  updateChrLocation,
  updateDefaultChrLocation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserBar);
