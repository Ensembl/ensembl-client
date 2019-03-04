import React, { FunctionComponent } from 'react';

import styles from './BrowserTabs.scss';

type BrowserTabsProps = {};

const BrowserTabs: FunctionComponent<BrowserTabsProps> = (
  props: BrowserTabsProps
) => {
  return (
    <dl className={`${styles.browserTabs} show-for-large`}>
      <dd>
        <button className={styles.browserTabActive}>Genomic</button>
      </dd>
      <dd>
        <button>Variation</button>
      </dd>
      <dd>
        <button>Expression</button>
      </dd>
    </dl>
  );
};

export default BrowserTabs;
