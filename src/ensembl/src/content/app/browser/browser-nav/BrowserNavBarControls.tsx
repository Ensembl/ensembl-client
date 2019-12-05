import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import BrowserNavIcon from './BrowserNavIcon';

import { browserNavConfig, BrowserNavItem } from '../browserConfig';
import {
  getBrowserNavStates,
  getRegionEditorActive,
  getRegionFieldActive
} from '../browserSelectors';
import { BrowserNavStates } from '../browserState';

import { RootState } from 'src/store';

import styles from './BrowserNavBarControls.scss';
import browserNavBarStyles from './BrowserNavBar.scss';

type Props = {
  browserNavStates: BrowserNavStates;
  shouldBeOpaque: boolean;
};

export const BrowserNavBarControls = (props: Props) => {
  const shouldEnableButton = (index: number) => {
    const isAtMaximum = props.browserNavStates[index];
    return !isAtMaximum;
  };

  const navBarControlsClassNames = classNames(styles.browserNavBarControls, {
    [browserNavBarStyles.semiOpaque]: props.shouldBeOpaque
  });

  return (
    <div className={navBarControlsClassNames}>
      {browserNavConfig.map((item: BrowserNavItem, index: number) => (
        <BrowserNavIcon
          key={item.name}
          browserNavItem={item}
          enabled={shouldEnableButton(index)}
        />
      ))}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const shouldBeOpaque =
    getRegionEditorActive(state) || getRegionFieldActive(state);

  return {
    browserNavStates: getBrowserNavStates(state),
    shouldBeOpaque
  };
};

export default connect(mapStateToProps)(BrowserNavBarControls);
