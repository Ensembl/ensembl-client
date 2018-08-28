import React, { Component } from 'react';

const chevronUpIcon = require('assets/img/track-panel/chevron-up-solid.svg');
const chevronDownIcon = require('assets/img/track-panel/chevron-down-solid.svg');

type BrowserBarProps = {
  expanded: boolean,
  drawerOpened: boolean
};

class BrowserBar extends Component<BrowserBarProps> {
  public render() {
    return (
      <div className="browser-bar">
        <dl>
          <dt className="slider">
            <button>
              {this.props.expanded ? <img src={chevronUpIcon} alt="collapse" /> : <img src={chevronDownIcon} alt="expand" />}
            </button>
          </dt>
        </dl>
      </div>
    );
  }
}

export default BrowserBar;
