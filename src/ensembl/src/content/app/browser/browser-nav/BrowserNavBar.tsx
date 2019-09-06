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
  getRegionEditorActive,
  getRegionFieldActive
} from '../browserSelectors';
import {
  toggleRegionEditorActive,
  toggleRegionFieldActive
} from '../browserActions';
import { getIsTrackPanelOpened } from '../track-panel/trackPanelSelectors';
import { BrowserNavStates, ChrLocation } from '../browserState';
import { getGenomeKaryotypes } from 'src/genome/genomeSelectors';
import { GenomeKaryotype } from 'src/genome/genomeTypes';

import styles from './BrowserNavBar.scss';

type BrowserNavBarProps = {
  browserNavStates: BrowserNavStates;
  chrLocation: ChrLocation | null;
  genomeKaryotypes: GenomeKaryotype[] | null;
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

  const shouldBeEnabled = (index: number) => {
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
            enabled={shouldBeEnabled(index)}
          />
        ))}
      </dd>
      <dd>{props.chrLocation ? <BrowserRegionField /> : null}</dd>
      <dd>
        {props.chrLocation && props.genomeKaryotypes ? (
          <BrowserRegionEditor />
        ) : null}
      </dd>
    </dl>
  );
};

const mapStateToProps = (state: RootState) => ({
  browserNavStates: getBrowserNavStates(state),
  chrLocation: getChrLocation(state),
  genomeKaryotypes: getGenomeKaryotypes(state),
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
