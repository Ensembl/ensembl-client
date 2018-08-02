import React, { Component } from 'react';

type Props = Object;
type State = {
  launchbarExpanded: boolean,
  accountExpanded: boolean
};

class Nav extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      launchbarExpanded: true,
      accountExpanded: false
    };

    this.toggleLaunchbar = this.toggleLaunchbar.bind(this);
    this.toggleAccount = this.toggleAccount.bind(this);
  }

  toggleLaunchbar(event: React.MouseEvent) {
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
      <div className="top-bar-right">
        <div className="inline icon fas fa-th" onClick={this.toggleLaunchbar}></div>
        <div className="inline icon far fa-user-circle" onClick={this.toggleAccount}></div>
      </div>
    );
  }
}

export default Nav;
