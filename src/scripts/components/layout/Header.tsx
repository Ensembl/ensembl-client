import React, { Component } from 'react';

import Nav from './Nav';

const Header = () => (
  <header>
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="inline logo">Ensembl</div>
        <div className="inline strapline">genome research database</div>
      </div>
      <Nav/>
    </div>
  </header>
);

export default Header;
