import React, { Component, ReactNode } from 'react';
import SlideDown from 'react-slidedown';
import { connect } from 'react-redux';

import { RootState } from '../../../reducers';
import { getAccountExpanded } from '../../../selectors/headerSelectors';

type StateProps = {
  accountExpanded: boolean;
};

type OwnProps = {};

type AccountProps = StateProps & OwnProps;

export class Account extends Component<AccountProps> {
  public render() {
    const AccountChildren: ReactNode = (
      <div className="account">
        <h2>Account area placeholder</h2>
      </div>
    );

    return (
      <SlideDown>
        {this.props.accountExpanded ? AccountChildren : null}
      </SlideDown>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  accountExpanded: getAccountExpanded(state)
});

export default connect(mapStateToProps)(Account);
