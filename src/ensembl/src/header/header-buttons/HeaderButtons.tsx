import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { toggleAccount, toggleLaunchbar } from '../headerActions';

import launchbarIcon from 'static/img/header/launchbar.svg';
import userIcon from 'static/img/header/user-grey.svg';

import styles from './HeaderButtons.scss';

type StateProps = {};

type DispatchProps = {
  toggleLaunchbar: () => void;
  toggleAccount: () => void;
};

type OwnProps = {};

type HeaderButtonsProps = StateProps & DispatchProps & OwnProps;

export const HeaderButtons: FunctionComponent<HeaderButtonsProps> = (props) => (
  <div className={styles.headerButtons}>
    <button className="launchbarButton" onClick={props.toggleLaunchbar}>
      <img
        src={launchbarIcon}
        alt="Toggle the Ensembl app launchbar"
        title="Ensembl app launchbar"
      />
    </button>
    <button className="accountButton disabled">
      <img
        src={userIcon}
        alt="Toggle the Ensembl account"
        title="Ensembl account"
      />
    </button>
  </div>
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
