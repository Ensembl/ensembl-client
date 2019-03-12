import React, { FunctionComponent, RefObject } from 'react';
import { connect } from 'react-redux';

import { browserNavConfig, BrowserNavItem } from '../browserConfig';

import { RootState } from 'src/store';
import { getBrowserNavStates } from '../browserSelectors';
import { BrowserNavStates } from '../browserState';

import BrowserNavIcon from './BrowserNavIcon';

import styles from './BrowserNavBar.scss';

type StateProps = {
  browserNavStates: BrowserNavStates;
};

type DispatchProps = {};

type OwnProps = {
  browserRef: RefObject<HTMLDivElement>;
};

type BrowserNavBarProps = StateProps & DispatchProps & OwnProps;

export const BrowserNavBar: FunctionComponent<BrowserNavBarProps> = (
  props: BrowserNavBarProps
) => {
  const browserImageEl = props.browserRef.current as HTMLDivElement;

  return (
    <div className={styles.browserNavBar}>
      <dl>
        {browserNavConfig.map((item: BrowserNavItem, index: number) => (
          <BrowserNavIcon
            key={item.name}
            browserNavItem={item}
            browserImageEl={browserImageEl}
            maxState={props.browserNavStates[index]}
          />
        ))}
      </dl>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserNavStates: getBrowserNavStates(state)
});

const mapDispatchToProps: DispatchProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserNavBar);
