import React, { Component } from 'react';

import resetIcon from 'assets/img/track-panel/reset.svg';
import chevronUpIcon from 'assets/img/track-panel/chevron-up.svg';
import chevronDownIcon from 'assets/img/track-panel/chevron-down.svg';

type BrowserBarProps = {
  drawerOpened: boolean;
  expanded: boolean;
};

class BrowserBar extends Component<BrowserBarProps> {
  public render() {
    return (
      <div className="browser-bar">
        <dl>
          <dt className="reset">
            <button>
              <img src={resetIcon} alt="reset" />
            </button>
          </dt>
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
