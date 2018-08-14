import React, { Component } from 'react';

import Nav from './Nav';
import Launchbar from './Launchbar';
import Account from './Account';

type HeaderProps = Object;
type HeaderState = {
  launchbarExpanded: boolean,
  accountExpanded: boolean
};

class Header extends Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);

    this.state = {
      launchbarExpanded: true,
      accountExpanded: false
    };

    this.toggleLaunchbar = this.toggleLaunchbar.bind(this);
    this.toggleAccount = this.toggleAccount.bind(this);
  }

  toggleLaunchbar(): void {
    const currentToggleState: boolean = !this.state.launchbarExpanded;

    this.setState({
      launchbarExpanded: currentToggleState
    });
  }

  toggleAccount(): void {
    const currentToggleState: boolean = !this.state.accountExpanded;

    this.setState({
      accountExpanded: currentToggleState
    });
  }

  render() {
    return (
      <header>
        <div className="top-bar">
          <div className="top-bar-left">
            <div className="inline logo">Ensembl</div>
            <div className="strapline">genome research database</div>
          </div>
          <Nav toggleLaunchbar={this.toggleLaunchbar} toggleAccount={this.toggleAccount} />
        </div>
        <Account expanded={this.state.accountExpanded} />
        <Launchbar expanded={this.state.launchbarExpanded} />
      </header>
    );
  }
}

export default Header;
