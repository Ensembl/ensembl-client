import React, { Component, ReactNode } from 'react';
import SlideDown from 'react-slidedown';

type AccountProps = {
  accountExpanded: boolean;
};

class Account extends Component<AccountProps> {
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

export default Account;
