import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import BrowserNavIcon from './BrowserNavIcon';
import BrowserNavBarMain from './BrowserNavBarMain';

import { RootState } from 'src/store';
import { browserNavConfig, BrowserNavItem } from '../browserConfig';
import {
  getBrowserNavStates,
  getRegionEditorActive,
  getRegionFieldActive
} from '../browserSelectors';
import {
  toggleRegionEditorActive,
  toggleRegionFieldActive
} from '../browserActions';
import { getIsTrackPanelOpened } from '../track-panel/trackPanelSelectors';
import { BrowserNavStates } from '../browserState';

import styles from './BrowserNavBar.scss';

export type BrowserNavBarProps = {
  browserNavStates: BrowserNavStates;
  isTrackPanelOpened: boolean;
  regionEditorActive: boolean;
  regionFieldActive: boolean;
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

  const shouldNavIconBeEnabled = (index: number) => {
    const { browserNavStates, regionEditorActive, regionFieldActive } = props;
    const maxState = browserNavStates[index];
    const regionInputsActive = regionEditorActive || regionFieldActive;

    return !maxState && !regionInputsActive;
  };

  const className = classNames(styles.browserNavBar, {
    [styles.browserNavBarExpanded]: !props.isTrackPanelOpened
  });

  return (
    <dl className={className}>
      <dd>
        {browserNavConfig.map((item: BrowserNavItem, index: number) => (
          <BrowserNavIcon
            key={item.name}
            browserNavItem={item}
            enabled={shouldNavIconBeEnabled(index)}
          />
        ))}
      </dd>
      <BrowserNavBarMain />
    </dl>
  );
};

const mapStateToProps = (state: RootState) => ({
  browserNavStates: getBrowserNavStates(state),
  isTrackPanelOpened: getIsTrackPanelOpened(state),
  regionEditorActive: getRegionEditorActive(state),
  regionFieldActive: getRegionFieldActive(state)
});

const mapDispatchToProps = {
  toggleRegionEditorActive,
  toggleRegionFieldActive
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserNavBar);
