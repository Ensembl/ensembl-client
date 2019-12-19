import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import BrowserRegionEditor from '../browser-region-editor/BrowserRegionEditor';
import BrowserRegionField from '../browser-region-field/BrowserRegionField';

import { BreakpointWidth } from 'src/global/globalConfig';

import {
  toggleRegionEditorActive,
  toggleRegionFieldActive
} from '../browserActions';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import { RootState } from 'src/store';

import styles from './BrowserNavBarRegionSwitcher.scss';

type Props = {
  viewportWidth: BreakpointWidth;
  toggleRegionEditorActive: (isActive: boolean) => void;
  toggleRegionFieldActive: (isActive: boolean) => void;
};

export const BrowserNavBarRegionSwitcher = (props: Props) => {
  // cleanup on unmount
  useEffect(
    () => () => {
      props.toggleRegionEditorActive(false);
      props.toggleRegionFieldActive(false);
    },
    []
  );

  return (
    <div className={styles.regionSwitcher}>
      <div className={styles.regionFieldWrapper}>
        <BrowserRegionField />
      </div>
      {props.viewportWidth >= BreakpointWidth.BIG_DESKTOP && (
        <div className={styles.regionEditorWrapper}>
          <BrowserRegionEditor />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  viewportWidth: getBreakpointWidth(state)
});

const mapDispatchToProps = {
  toggleRegionEditorActive,
  toggleRegionFieldActive
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserNavBarRegionSwitcher);
