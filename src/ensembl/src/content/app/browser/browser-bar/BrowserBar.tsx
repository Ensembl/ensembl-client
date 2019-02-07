import React, { FunctionComponent, memo } from 'react';
import ContentEditable from 'react-contenteditable';

import { browserInfoConfig } from '../browserConfig';

import styles from './BrowserBar.scss';

type BrowserBarProps = {
  browserNavOpened: boolean;
  expanded: boolean;
  toggleBrowserNav: () => void;
};

export const BrowserBar: FunctionComponent<BrowserBarProps> = (
  props: BrowserBarProps
) => {
  const { navigator, reset } = browserInfoConfig;

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
            <ContentEditable html={'13'} className="content-editable-box" />
            <ContentEditable html={'32,315,474 - 32,400,266'} />
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
      <dl className={styles.browserTabs}>
        <dd>
          <button className={styles.active}>Key Data</button>
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

export default memo(BrowserBar);
