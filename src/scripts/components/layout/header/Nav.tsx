import React, { Component, MouseEventHandler, SFC } from 'react';
import { imgBaseUrl } from '../../../configs/globalConfig';

type NavProps = {
  toggleLaunchbar: MouseEventHandler,
  toggleAccount: MouseEventHandler
};

const Nav: SFC<NavProps> = (props: NavProps) => (
  <div className="top-bar-right">
    <button className="inline" onClick={props.toggleLaunchbar}>
      <img src={`${imgBaseUrl}/launchbar/header_icon_placeholder.png`} alt="toggle launchbar" title="Launchbar" />
    </button>
    <button className="inline" onClick={props.toggleAccount}>
      <img src={`${imgBaseUrl}/launchbar/header_icon_placeholder.png`} alt="toggle account" title="Account" />
    </button>
  </div>
);

export default Nav;
