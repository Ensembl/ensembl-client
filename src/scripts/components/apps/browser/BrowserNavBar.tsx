import React, { Component, createRef } from 'react';

import {
  browserNavConfig,
  BrowserNavItem
} from '../../../configs/browserConfig';

import navigateRightIcon from 'assets/img/browser/navigate-right.svg';

type BrowserNavBarProps = {};

class BrowserNavBar extends Component<BrowserNavBarProps> {
  // private navListeners = {
  //   'navigate-right': (e) => {
  //     const leftEvent = new CustomEvent('bpane', { move_left_px: 50 });
  //     e.target.dispatchEvent(leftEvent);
  //   }
  // };

  constructor(props: BrowserNavBarProps) {
    super(props);

    this.moveLeft = this.moveLeft.bind(this);
  }

  moveLeft(e) {
    console.log(window.document.querySelector('#bpane-canv'));
    const leftEvent = new CustomEvent('bpane', {
      move_left_px: 50,
      bubbles: true
    });
    window.document.querySelector('#bpane-canv').dispatchEvent(leftEvent);
  }

  public render() {
    return (
      <div className="browser-nav-bar">
        <dl>
          {browserNavConfig.map((item: BrowserNavItem) => (
            <dt key={item.name}>
              <button title={item.description}>
                <img src={item.icon.default} alt={item.description} />
              </button>
            </dt>
          ))}
          <dt>
            <button onClick={this.moveLeft}>
              <img src={navigateRightIcon} alt={'navigate right'} />
            </button>
          </dt>
        </dl>
      </div>
    );
  }
}

export default BrowserNavBar;
