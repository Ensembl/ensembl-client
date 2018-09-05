import React, { Component } from 'react';

import chevronUpIcon from 'assets/img/track-panel/chevron-up.svg';
import chevronDownIcon from 'assets/img/track-panel/chevron-down.svg';

type BrowserBarProps = {
  expanded: boolean;
  drawerOpened: boolean;
};

class BrowserBar extends Component<BrowserBarProps> {
  public render() {
    return (
      <div className="browser-bar">
        <dl>
          <dt className="slider">
            <button>
              {this.props.expanded ? (
                <img src={chevronUpIcon} alt="collapse" />
              ) : (
                <img src={chevronDownIcon} alt="expand" />
              )}
            </button>
          </dt>
        </dl>
      </div>
    );
  }
}

export default BrowserBar;
