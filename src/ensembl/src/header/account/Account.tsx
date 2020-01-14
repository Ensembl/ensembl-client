import React from 'react';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { getAccountExpanded } from '../headerSelectors';

import styles from './Account.scss';

type StateProps = {
  accountExpanded: boolean;
};

type OwnProps = {};

type AccountProps = StateProps & OwnProps;

export const Account = (props: AccountProps) => {
  return props.accountExpanded ? (
    <div className={styles.account}>
      <h2>Account area placeholder</h2>
    </div>
  ) : null;
};

const mapStateToProps = (state: RootState): StateProps => ({
  accountExpanded: getAccountExpanded(state)
});

export default connect(mapStateToProps)(Account);
