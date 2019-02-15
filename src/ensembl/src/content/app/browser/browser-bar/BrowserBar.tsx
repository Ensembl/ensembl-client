import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import ContentEditable from 'react-contenteditable';

import { browserInfoConfig } from '../browserConfig';

import { toggleBrowserNav } from '../browserActions';
import { ChrLocation } from '../browserState';
import { RootState } from 'src/rootReducer';
import { getBrowserNavOpened, getChrLocation } from '../browserSelectors';

import styles from './BrowserBar.scss';

type StateProps = {
  browserNavOpened: boolean;
  chrLocation: ChrLocation;
};

type DispatchProps = {
  toggleBrowserNav: () => void;
};

type OwnProps = {};

type BrowserBarProps = StateProps & DispatchProps & OwnProps;

export const BrowserBar: FunctionComponent<BrowserBarProps> = (
  props: BrowserBarProps
) => {
  const { navigator, reset } = browserInfoConfig;
  const [chrCode, chrStart, chrEnd] = props.chrLocation;

  return (
    <div className={styles.browserBar}>
      <div className={styles.browserInfo}>
        <dl className={styles.browserInfoLeft}>
          <dd className={styles.resetButton}>
            <button>
              <img src={reset.icon.default} alt={reset.description} />
            </button>
          </dd>
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
          <dd>
            <label className="show-for-large">Chromosome</label>
            <ContentEditable
              html={`${chrCode}`}
              className="content-editable-box"
            />
            <ContentEditable html={`${chrStart}`} />
            <span> - </span>
            <ContentEditable html={`${chrEnd}`} />
          </dd>
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
  browserNavOpened: getBrowserNavOpened(state),
  chrLocation: getChrLocation(state)
});

const mapDispatchToProps: DispatchProps = {
  toggleBrowserNav
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserBar);
