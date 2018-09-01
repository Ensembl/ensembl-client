import React, { ReactEventHandler, SFC } from 'react';

import headerIcon from 'assets/img/launchbar/header_icon_placeholder.png';

type NavProps = {
  toggleLaunchbar: ReactEventHandler,
  toggleAccount: ReactEventHandler
};

const Nav: SFC<NavProps> = (props: NavProps) => (
  <div className="top-bar-right">
    <button className="inline" onClick={props.toggleLaunchbar}>
      <img src={headerIcon} alt="toggle launchbar" title="Launchbar" />
    </button>
    <button className="inline" onClick={props.toggleAccount}>
      <img src={headerIcon} alt="toggle account" title="Account" />
    </button>
  </div>
);

export default Nav;
