import React, { FunctionComponent, RefObject } from 'react';
import { connect } from 'react-redux';

import { browserInfoConfig } from '../browserConfig';
import { toggleBrowserNav, updateDefaultChrLocation } from '../browserActions';
import { ChrLocation } from '../browserState';
import {
  getBrowserNavOpened,
  getChrLocation,
  getBrowserActivated
} from '../browserSelectors';
import { RootState } from 'src/rootReducer';

import BrowserReset from '../browser-reset/BrowserReset';
import BrowserGenomeSelector from '../browser-genome-selector/BrowserGenomeSelector';

import styles from './BrowserBar.scss';

type StateProps = {
  browserActivated: boolean;
  browserNavOpened: boolean;
  chrLocation: ChrLocation;
};

type DispatchProps = {
  toggleBrowserNav: () => void;
  updateDefaultChrLocation: (chrLocation: ChrLocation) => void;
};

type OwnProps = {
  browserRef: RefObject<HTMLDivElement>;
};

type BrowserBarProps = StateProps & DispatchProps & OwnProps;

export const BrowserBar: FunctionComponent<BrowserBarProps> = (
  props: BrowserBarProps
) => {
  const { navigator, reset } = browserInfoConfig;
  const browserImageEl = props.browserRef.current as HTMLDivElement;

  return (
    <div className={styles.browserBar}>
      <div className={styles.browserInfo}>
        <dl className={styles.browserInfoLeft}>
          <BrowserReset browserImageEl={browserImageEl} details={reset} />
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
          <dd className="show-for-large">protein coding</dd>
          <dd className="show-for-large">forward strand</dd>
        </dl>
        <dl className={styles.browserInfoRight}>
          <BrowserGenomeSelector
            browserActivated={props.browserActivated}
            chrLocation={props.chrLocation}
            updateDefaultChrLocation={props.updateDefaultChrLocation}
          />
          <dd className={styles.navigator}>
            <button
              title={navigator.description}
              onClick={props.toggleBrowserNav}
            >
              <img
                src={
                  props.browserNavOpened
                    ? navigator.icon.selected
                    : navigator.icon.default
                }
                alt={navigator.description}
              />
            </button>
          </dd>
        </dl>
      </div>
      <dl className={`${styles.browserTabs} show-for-large`}>
        <dd>
          <button className={styles.active}>Genomic</button>
        </dd>
        <dd>
          <button>Variation</button>
        </dd>
        <dd>
          <button>Expression</button>
        </dd>
      </dl>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserActivated: getBrowserActivated(state),
  browserNavOpened: getBrowserNavOpened(state),
  chrLocation: getChrLocation(state)
});

const mapDispatchToProps: DispatchProps = {
  toggleBrowserNav,
  updateDefaultChrLocation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserBar);
