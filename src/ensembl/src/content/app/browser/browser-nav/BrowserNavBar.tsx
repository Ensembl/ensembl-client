import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { browserNavConfig, BrowserNavItem } from '../browserConfig';

import { RootState } from 'src/store';
import { getBrowserNavStates } from '../browserSelectors';
import { getTrackPanelOpened } from '../track-panel/trackPanelSelectors';
import { BrowserNavStates } from '../browserState';

import BrowserNavIcon from './BrowserNavIcon';

import styles from './BrowserNavBar.scss';

type StateProps = {
  browserNavStates: BrowserNavStates;
  trackPanelOpened: boolean;
};

type DispatchProps = {};

type OwnProps = {};

type BrowserNavBarProps = StateProps & DispatchProps & OwnProps;

export const BrowserNavBar: FunctionComponent<BrowserNavBarProps> = (
  props: BrowserNavBarProps
) => {
  const className = classNames(styles.browserNavBar, {
    [styles.browserNavBarExpanded]: !props.trackPanelOpened
  });

  return (
    <div className={className}>
      <dl>
        {browserNavConfig.map((item: BrowserNavItem, index: number) => (
          <BrowserNavIcon
            key={item.name}
            browserNavItem={item}
            maxState={props.browserNavStates[index]}
          />
        ))}
      </dl>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserNavStates: getBrowserNavStates(state),
  trackPanelOpened: getTrackPanelOpened(state)
});

const mapDispatchToProps: DispatchProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserNavBar);
