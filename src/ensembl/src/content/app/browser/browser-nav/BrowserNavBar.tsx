import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import BrowserNavIcon from './BrowserNavIcon';
import BrowserRegionEditor from '../browser-region-editor/BrowserRegionEditor';
import BrowserRegionField from '../browser-region-field/BrowserRegionField';

import { RootState } from 'src/store';
import { browserNavConfig, BrowserNavItem } from '../browserConfig';
import {
  getBrowserNavStates,
  getChrLocation,
  getBrowserRegionEditorActive,
  getBrowserRegionFieldActive
} from '../browserSelectors';
import {
  toggleBrowserRegionEditorActive,
  toggleBrowserRegionFieldActive
} from '../browserActions';
import { getIsTrackPanelOpened } from '../track-panel/trackPanelSelectors';
import { BrowserNavStates, ChrLocation } from '../browserState';
import { getGenomeKaryotypes } from 'src/genome/genomeSelectors';
import { GenomeKaryotype } from 'src/genome/genomeTypes';

import styles from './BrowserNavBar.scss';

type BrowserNavBarProps = {
  browserNavStates: BrowserNavStates;
  browserRegionEditorActive: boolean;
  browserRegionFieldActive: boolean;
  chrLocation: ChrLocation | null;
  genomeKaryotypes: GenomeKaryotype[] | null;
  isTrackPanelOpened: boolean;
  dispatchBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  toggleBrowserRegionEditorActive: (browserRegionEditorActive: boolean) => void;
  toggleBrowserRegionFieldActive: (browserRegionFieldActive: boolean) => void;
};

export const BrowserNavBar = (props: BrowserNavBarProps) => {
  // the region editor and field style should be reset so that it won't be opaque when nav bar is opened again
  useEffect(
    () => () => {
      props.toggleBrowserRegionEditorActive(false);
      props.toggleBrowserRegionFieldActive(false);
    },
    []
  );

  const className = classNames(styles.browserNavBar, {
    [styles.browserNavBarExpanded]: !props.isTrackPanelOpened
  });

  return (
    <div className={className}>
      {props.browserRegionEditorActive && props.browserRegionFieldActive ? (
        <div className={styles.browserNavBarOverlay}></div>
      ) : null}
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
        {props.chrLocation ? (
          <BrowserRegionField
            dispatchBrowserLocation={props.dispatchBrowserLocation}
          />
        ) : null}
      </dl>
      <dl>
        {props.chrLocation && props.genomeKaryotypes ? (
          <BrowserRegionEditor />
        ) : null}
      </dl>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  browserNavStates: getBrowserNavStates(state),
  browserRegionEditorActive: getBrowserRegionEditorActive(state),
  browserRegionFieldActive: getBrowserRegionFieldActive(state),
  chrLocation: getChrLocation(state),
  genomeKaryotypes: getGenomeKaryotypes(state),
  isTrackPanelOpened: getIsTrackPanelOpened(state)
});

const mapDispatchToProps = {
  toggleBrowserRegionEditorActive,
  toggleBrowserRegionFieldActive
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserNavBar);
