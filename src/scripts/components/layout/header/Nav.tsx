import React, { Component, MouseEventHandler, SFC } from 'react';

type NavProps = {
  toggleLaunchbar: MouseEventHandler,
  toggleAccount: MouseEventHandler
};

const headerIcon = require('../../../../../assets/img/launchbar/header_icon_placeholder.png');

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
