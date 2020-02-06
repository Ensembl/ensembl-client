import React from 'react';
import { connect } from 'react-redux';

import BrowserNavIcon from './BrowserNavIcon';
import Overlay from 'src/shared/components/overlay/Overlay';

import { browserNavConfig, BrowserNavItem } from '../browserConfig';
import {
  getBrowserNavStates,
  getRegionEditorActive,
  getRegionFieldActive
} from '../browserSelectors';
import { BrowserNavStates } from '../browserState';

import { RootState } from 'src/store';

import styles from './BrowserNavBarControls.scss';

type Props = {
  browserNavStates: BrowserNavStates;
  isDisabled: boolean;
};

export const BrowserNavBarControls = (props: Props) => (
  <div className={styles.browserNavBarControls}>
    {browserNavConfig.map((item: BrowserNavItem, index: number) => (
      <BrowserNavIcon
        key={item.name}
        browserNavItem={item}
        enabled={!props.browserNavStates[index]}
      />
    ))}
    {props.isDisabled && <Overlay className={styles.overlay} />}
  </div>
);

const mapStateToProps = (state: RootState) => {
  const isDisabled =
    getRegionEditorActive(state) || getRegionFieldActive(state);

  return {
    browserNavStates: getBrowserNavStates(state),
    isDisabled
  };
};

export default connect(mapStateToProps)(BrowserNavBarControls);
