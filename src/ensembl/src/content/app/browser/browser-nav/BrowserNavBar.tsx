import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import BrowserRegionField from '../browser-region-field/BrowserRegionField';

import { RootState } from 'src/store';
import { browserNavConfig, BrowserNavItem } from '../browserConfig';
import {
  getBrowserNavStates,
  getChrLocation,
  getGenomeSelectorActive
} from '../browserSelectors';
import { getIsTrackPanelOpened } from '../track-panel/trackPanelSelectors';
import { BrowserNavStates, ChrLocation } from '../browserState';

import BrowserNavIcon from './BrowserNavIcon';

import styles from './BrowserNavBar.scss';

type BrowserNavBarProps = {
  browserNavStates: BrowserNavStates;
  chrLocation: ChrLocation | null;
  isTrackPanelOpened: boolean;
  genomeSelectorActive: boolean;
  dispatchBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
};

export const BrowserNavBar = (props: BrowserNavBarProps) => {
  const className = classNames(styles.browserNavBar, {
    [styles.browserNavBarExpanded]: !props.isTrackPanelOpened
  });

  return (
    <div className={className}>
      {props.genomeSelectorActive && (
        <div className={styles.browserNavBarOverlay}></div>
      )}
      <dl className={styles.aboveOverlay}>
        {browserNavConfig.map((item: BrowserNavItem, index: number) => (
          <BrowserNavIcon
            key={item.name}
            browserNavItem={item}
            maxState={props.browserNavStates[index]}
          />
        ))}
      </dl>
      <dl className={styles.aboveOverlay}>
        {props.chrLocation && (
          <BrowserRegionField
            dispatchBrowserLocation={props.dispatchBrowserLocation}
          />
        )}
      </dl>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  browserNavStates: getBrowserNavStates(state),
  chrLocation: getChrLocation(state),
  isTrackPanelOpened: getIsTrackPanelOpened(state),
  genomeSelectorActive: getGenomeSelectorActive(state)
});

export default connect(mapStateToProps)(BrowserNavBar);
