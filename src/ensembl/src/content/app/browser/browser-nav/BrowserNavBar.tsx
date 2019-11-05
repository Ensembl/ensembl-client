import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import BrowserNavBarControls from './BrowserNavBarControls';
import BrowserNavBarMain from './BrowserNavBarMain';

import { RootState } from 'src/store';
import {
  toggleRegionEditorActive,
  toggleRegionFieldActive
} from '../browserActions';
import { getIsTrackPanelOpened } from '../track-panel/trackPanelSelectors';

import styles from './BrowserNavBar.scss';

export type BrowserNavBarProps = {
  expanded: boolean;
  toggleRegionEditorActive: (regionEditorActive: boolean) => void;
  toggleRegionFieldActive: (regionFieldActive: boolean) => void;
};

export const BrowserNavBar = (props: BrowserNavBarProps) => {
  // the region editor and field style should be reset so that it won't be opaque when nav bar is opened again
  useEffect(
    () => () => {
      props.toggleRegionEditorActive(false);
      props.toggleRegionFieldActive(false);
    },
    []
  );
  // FIXME: do something to the above

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

const mapDispatchToProps = {
  toggleRegionEditorActive,
  toggleRegionFieldActive
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserNavBar);
