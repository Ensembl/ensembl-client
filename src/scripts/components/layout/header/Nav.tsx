import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { toggleAccount, toggleLaunchbar } from '../../../actions/headerActions';

import launchbarIcon from 'assets/img/header/launchbar.svg';
import userIcon from 'assets/img/header/user.svg';

export type NavProps = {
  toggleLaunchbar: () => void;
  toggleAccount: () => void;
};

export class Nav extends PureComponent<NavProps> {
  public render() {
    return (
      <div className="top-bar-right">
        <button
          className="inline launchbar-button"
          onClick={this.props.toggleLaunchbar}
        >
          <img src={launchbarIcon} alt="toggle launchbar" title="Launchbar" />
        </button>
        <button
          className="inline account-button"
          onClick={this.props.toggleAccount}
        >
          <img src={userIcon} alt="toggle account" title="Account" />
        </button>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  toggleAccount,
  toggleLaunchbar
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav);
