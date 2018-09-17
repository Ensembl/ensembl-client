import React, { SFC } from 'react';

import Nav from './Nav';
import Launchbar from './launchbar/Launchbar';
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
    <Launchbar />
  </header>
);

export default Header;
