import React, { FunctionComponent, ReactNode } from 'react';
import SlideDown from 'react-slidedown';
import { connect } from 'react-redux';

import { RootState } from 'src/rootReducer';
import { getAccountExpanded } from '../headerSelectors';

import styles from './Account.scss';

type StateProps = {
  accountExpanded: boolean;
};

type OwnProps = {};

type AccountProps = StateProps & OwnProps;

export const Account: FunctionComponent<AccountProps> = (
  props: AccountProps
) => {
  const AccountChildren: ReactNode = (
    <div className={styles.account}>
      <h2>Account area placeholder</h2>
    </div>
  );

  return (
    <SlideDown>{props.accountExpanded ? AccountChildren : null}</SlideDown>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  accountExpanded: getAccountExpanded(state)
});

export default connect(mapStateToProps)(Account);
