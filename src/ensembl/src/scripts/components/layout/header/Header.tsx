import React, { SFC } from 'react';

import Nav from './Nav';
import LaunchbarContainer from './launchbar/LaunchbarContainer';
import Account from './Account';

type HeaderProps = {};

const Header: SFC<HeaderProps> = () => (
  <header>
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="inline logo">Ensembl</div>
        <div className="strapline">genome research database</div>
      </div>
      <Nav />
    </div>
    <Account />
    <LaunchbarContainer />
  </header>
);

export default Header;
