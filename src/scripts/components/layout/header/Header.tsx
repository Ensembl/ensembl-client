import React, { Component } from 'react';

import Nav from './Nav';
import Launchbar from './Launchbar';
import Account from './Account';

type HeaderProps = {};
type HeaderState = {
  accountExpanded: boolean;
  launchbarExpanded: boolean;
};

class Header extends Component<HeaderProps, HeaderState> {
  public readonly state: HeaderState = {
    accountExpanded: false,
    launchbarExpanded: true
  };

  constructor(props: HeaderProps) {
    super(props);

    this.toggleLaunchbar = this.toggleLaunchbar.bind(this);
    this.toggleAccount = this.toggleAccount.bind(this);
  }

  public toggleLaunchbar() {
    const currentToggleState: boolean = !this.state.launchbarExpanded;

    this.setState({
      launchbarExpanded: currentToggleState
    });
  }

  public toggleAccount() {
    const currentToggleState: boolean = !this.state.accountExpanded;

    this.setState({
      accountExpanded: currentToggleState
    });
  }

  public render() {
    return (
      <header>
        <div className="top-bar">
          <div className="top-bar-left">
            <div className="inline logo">Ensembl</div>
            <div className="strapline">genome research database</div>
          </div>
          <Nav
            toggleLaunchbar={this.toggleLaunchbar}
            toggleAccount={this.toggleAccount}
          />
        </div>
        <Account expanded={this.state.accountExpanded} />
        <Launchbar expanded={this.state.launchbarExpanded} />
      </header>
    );
  }
}

export default Header;
