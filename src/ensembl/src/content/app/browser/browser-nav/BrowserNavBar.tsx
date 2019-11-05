import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import BrowserNavBarControls from './BrowserNavBarControls';
import BrowserNavBarMain from './BrowserNavBarMain';

import { RootState } from 'src/store';
import { getIsTrackPanelOpened } from '../track-panel/trackPanelSelectors';

import styles from './BrowserNavBar.scss';

export type BrowserNavBarProps = {
  expanded: boolean;
};

export const BrowserNavBar = (props: BrowserNavBarProps) => {
  const className = classNames(styles.browserNavBar, {
    [styles.browserNavBarExpanded]: props.expanded
  });

  return (
    <div className={className}>
      <BrowserNavBarControls />
      <BrowserNavBarMain />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  expanded: !getIsTrackPanelOpened(state)
});

export default connect(mapStateToProps)(BrowserNavBar);
