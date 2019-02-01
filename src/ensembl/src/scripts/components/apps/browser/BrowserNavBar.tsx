import React, { Component } from 'react';

import {
  browserNavConfig,
  BrowserNavItem
} from '../../../configs/browserConfig';

import BrowserNavIcon from './BrowserNavIcon';

type BrowserNavBarProps = {};

class BrowserNavBar extends Component<BrowserNavBarProps> {
  public render() {
    return (
      <div className="browser-nav-bar">
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
