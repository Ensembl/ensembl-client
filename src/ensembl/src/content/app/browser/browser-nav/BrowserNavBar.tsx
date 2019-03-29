import React, { FunctionComponent, RefObject } from 'react';
import { connect } from 'react-redux';

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

type OwnProps = {
  browserRef: RefObject<HTMLDivElement>;
};

type BrowserNavBarProps = StateProps & DispatchProps & OwnProps;

export const BrowserNavBar: FunctionComponent<BrowserNavBarProps> = (
  props: BrowserNavBarProps
) => {
  const browserImageEl = props.browserRef.current as HTMLDivElement;

  const getClassNames = () => {
    let classNames = styles.browserNavBar;

    if (props.trackPanelOpened === false) {
      classNames += ` ${styles.browserNavBarExpanded}`;
    }

    return classNames;
  };

  return (
    <div className={getClassNames()}>
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
  browserNavStates: getBrowserNavStates(state),
  trackPanelOpened: getTrackPanelOpened(state)
});

const mapDispatchToProps: DispatchProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserNavBar);
