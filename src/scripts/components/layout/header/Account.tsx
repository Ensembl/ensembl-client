import React, { Component, ReactNode } from 'react';
import { SlideDown } from 'react-slidedown';

type AccountProps = {
  expanded: boolean
};

class Account extends Component<AccountProps> {
  render() {
    const AccountChildren: ReactNode = (
      <div className="account">
        <h2>Account area placeholder</h2>
      </div>
    );

    return (
      <SlideDown>
        { this.props.expanded ? AccountChildren : null }
      </SlideDown>
    );
  }
}

export default Account;
