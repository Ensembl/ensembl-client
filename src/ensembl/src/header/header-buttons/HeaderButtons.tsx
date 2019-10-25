import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { toggleAccount, toggleLaunchbar } from '../headerActions';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as LaunchbarIcon } from 'static/img/header/launchbar.svg';
import { ReactComponent as UserIcon } from 'static/img/header/user-grey.svg';

import { Status } from 'src/shared/types/status';

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
    <div className={styles.buttonWrapper}>
      <ImageButton
        image={LaunchbarIcon}
        description="Ensembl app launchbar"
        onClick={props.toggleLaunchbar}
      />
    </div>
    <div className={styles.buttonWrapper}>
      <ImageButton
        image={UserIcon}
        description="Ensembl account"
        buttonStatus={Status.DISABLED}
        classNames={{
          [Status.DISABLED]: styles.headerButtonDisabled
        }}
      />
    </div>
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
