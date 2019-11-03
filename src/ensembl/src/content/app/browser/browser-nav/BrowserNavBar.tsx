import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import BrowserNavIcon from './BrowserNavIcon';
import BrowserNavBarMain from './BrowserNavBarMain';
import BrowserRegionEditor from '../browser-region-editor/BrowserRegionEditor';
import BrowserRegionField from '../browser-region-field/BrowserRegionField';

import { RootState } from 'src/store';
import { browserNavConfig, BrowserNavItem } from '../browserConfig';
import {
  getBrowserNavStates,
  getChrLocation,
  getRegionEditorActive,
  getRegionFieldActive
} from '../browserSelectors';
import {
  toggleRegionEditorActive,
  toggleRegionFieldActive
} from '../browserActions';
import { getIsTrackPanelOpened } from '../track-panel/trackPanelSelectors';
import { BrowserNavStates, ChrLocation } from '../browserState';
import { getGenomeKaryotype } from 'src/shared/state/genome/genomeSelectors';
import { GenomeKaryotypeItem } from 'src/shared/state/genome/genomeTypes';

import styles from './BrowserNavBar.scss';

export type BrowserNavBarProps = {
  browserNavStates: BrowserNavStates;
  chrLocation: ChrLocation | null;
  genomeKaryotype: GenomeKaryotypeItem[] | null;
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
      {/*
        <dd>{props.chrLocation ? <BrowserRegionField /> : null}</dd>
        <dd>
          {props.chrLocation && props.genomeKaryotype ? (
            <BrowserRegionEditor />
          ) : null}
        </dd>
        */}
    </dl>
  );
};

const mapStateToProps = (state: RootState) => ({
  browserNavStates: getBrowserNavStates(state),
  chrLocation: getChrLocation(state),
  genomeKaryotype: getGenomeKaryotype(state),
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
