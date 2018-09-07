import React, { SFC } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import Nav from './Nav';
import Launchbar from './launchbar/Launchbar';
import Account from './Account';
import { toggleAccount, toggleLaunchbar } from '../../../actions/headerActions';
import { RootState } from '../../../reducers';

type HeaderProps = {
  accountExpanded: boolean;
  launchbarExpanded: boolean;
  toggleAccount: () => void;
  toggleLaunchbar: () => void;
};

const Header: SFC<HeaderProps> = (props: HeaderProps) => (
  <header>
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="inline logo">Ensembl</div>
        <div className="strapline">genome research database</div>
      </div>
      <Nav
        toggleAccount={props.toggleAccount}
        toggleLaunchbar={props.toggleLaunchbar}
      />
    </div>
    <Account accountExpanded={props.accountExpanded} />
    <Launchbar launchbarExpanded={props.launchbarExpanded} />
  </header>
);

const mapStateToProps = (state: RootState) => {
  const { accountExpanded, launchbarExpanded } = state.header;
  return { accountExpanded, launchbarExpanded };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleAccount: () => dispatch(toggleAccount()),
  toggleLaunchbar: () => dispatch(toggleLaunchbar())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
