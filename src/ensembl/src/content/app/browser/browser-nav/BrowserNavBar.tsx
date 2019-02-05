import React, { FunctionComponent } from 'react';

import { browserNavConfig, BrowserNavItem } from '../browserConfig';

import BrowserNavIcon from './BrowserNavIcon';

import styles from './BrowserNavBar.scss';

type BrowserNavBarProps = {};

const BrowserNavBar: FunctionComponent<BrowserNavBarProps> = () => (
  <div className={styles.browserNavBar}>
    <dl>
      {browserNavConfig.map((item: BrowserNavItem) => (
        <BrowserNavIcon key={item.name} browserNavItem={item} />
      ))}
    </dl>
  </div>
);

export default BrowserNavBar;
