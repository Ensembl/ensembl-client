import React, { SFC } from 'react';

import launchbarIcon from 'assets/img/header/launchbar.svg';
import userIcon from 'assets/img/header/user.svg';

type NavProps = {
  toggleLaunchbar: () => void;
  toggleAccount: () => void;
};

const Nav: SFC<NavProps> = (props: NavProps) => (
  <div className="top-bar-right">
    <button className="inline" onClick={props.toggleLaunchbar}>
      <img src={launchbarIcon} alt="toggle launchbar" title="Launchbar" />
    </button>
    <button className="inline" onClick={props.toggleAccount}>
      <img src={userIcon} alt="toggle account" title="Account" />
    </button>
  </div>
);

export default Nav;
