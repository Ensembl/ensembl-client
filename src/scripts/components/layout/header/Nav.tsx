import React, { PureComponent } from 'react';

import launchbarIcon from 'assets/img/header/launchbar.svg';
import userIcon from 'assets/img/header/user.svg';

type NavProps = {
  toggleLaunchbar: () => void;
  toggleAccount: () => void;
};

class Nav extends PureComponent<NavProps> {
  public render() {
    return (
      <div className="top-bar-right">
        <button className="inline" onClick={this.props.toggleLaunchbar}>
          <img src={launchbarIcon} alt="toggle launchbar" title="Launchbar" />
        </button>
        <button className="inline" onClick={this.props.toggleAccount}>
          <img src={userIcon} alt="toggle account" title="Account" />
        </button>
      </div>
    );
  }
}

export default Nav;
