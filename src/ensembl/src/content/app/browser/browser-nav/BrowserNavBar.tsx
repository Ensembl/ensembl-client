import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { browserNavConfig, BrowserNavItem } from '../browserConfig';

import { RootState } from 'src/store';
import { getBrowserNavStates } from '../browserSelectors';
import { getIsTrackPanelOpened } from '../track-panel/trackPanelSelectors';
import { BrowserNavStates } from '../browserState';

import BrowserNavIcon from './BrowserNavIcon';

import styles from './BrowserNavBar.scss';

type StateProps = {
  browserNavStates: BrowserNavStates;
  isTrackPanelOpened: boolean;
};

type DispatchProps = {};

type OwnProps = {
  browserElement: HTMLDivElement;
};

type BrowserNavBarProps = StateProps & DispatchProps & OwnProps;

export const BrowserNavBar: FunctionComponent<BrowserNavBarProps> = (
  props: BrowserNavBarProps
) => {
  const className = classNames(styles.browserNavBar, {
    [styles.browserNavBarExpanded]: !props.isTrackPanelOpened
  });

  return (
    <div className={className}>
      <dl>
        {browserNavConfig.map((item: BrowserNavItem, index: number) => (
          <BrowserNavIcon
            key={item.name}
            browserNavItem={item}
            browserImageEl={props.browserElement}
            maxState={props.browserNavStates[index]}
          />
        ))}
      </dl>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserNavStates: getBrowserNavStates(state),
  isTrackPanelOpened: getIsTrackPanelOpened(state)
});

const mapDispatchToProps: DispatchProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserNavBar);
