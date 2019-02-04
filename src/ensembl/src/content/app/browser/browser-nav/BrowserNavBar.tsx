import React, { Component } from 'react';

import { browserNavConfig, BrowserNavItem } from '../browserConfig';

import BrowserNavIcon from './BrowserNavIcon';

import styles from './BrowserNavBar.scss';

type BrowserNavBarProps = {};

class BrowserNavBar extends Component<BrowserNavBarProps> {
  public render() {
    return (
      <div className={styles.browserNavBar}>
        <dl>
          {browserNavConfig.map((item: BrowserNavItem) => (
            <BrowserNavIcon key={item.name} browserNavItem={item} />
          ))}
        </dl>
      </div>
    );
  }
}

export default BrowserNavBar;
