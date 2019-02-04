import React, { FunctionComponent, memo } from 'react';
import { connect } from 'react-redux';

import { toggleAccount, toggleLaunchbar } from '../headerActions';

import launchbarIcon from 'static/img/header/launchbar.svg';
import userIcon from 'static/img/header/user.svg';

import styles from './HeaderButtons.scss';

type StateProps = {};

type DispatchProps = {
  toggleLaunchbar: () => void;
  toggleAccount: () => void;
};

type OwnProps = {};

type HeaderButtonsProps = StateProps & DispatchProps & OwnProps;

export const HeaderButtons: FunctionComponent<HeaderButtonsProps> = memo(
  (props) => (
    <div className={styles.headerButtons}>
      <button className="launchbarButton" onClick={props.toggleLaunchbar}>
        <img src={launchbarIcon} alt="toggle launchbar" title="Launchbar" />
      </button>
      <button className="accountButton" onClick={props.toggleAccount}>
        <img src={userIcon} alt="toggle account" title="Account" />
      </button>
    </div>
  )
);

const mapStateToProps = (): StateProps => ({});

const mapDispatchToProps: DispatchProps = {
  toggleAccount,
  toggleLaunchbar
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderButtons);
