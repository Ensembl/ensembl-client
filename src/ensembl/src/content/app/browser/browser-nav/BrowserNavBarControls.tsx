import React from 'react';
import { connect } from 'react-redux';

import BrowserNavIcon from './BrowserNavIcon';

import { RootState } from 'src/store';
import { browserNavConfig, BrowserNavItem } from '../browserConfig';
import {
  getBrowserNavStates,
  getRegionEditorActive,
  getRegionFieldActive
} from '../browserSelectors';
import { BrowserNavStates } from '../browserState';

type Props = {
  browserNavStates: BrowserNavStates;
  disabled: boolean;
};

export const BrowserNavBarControls = (props: Props) => {
  const shouldEnableButton = (index: number) => {
    const { browserNavStates, disabled } = props;
    const isAtMaximum = browserNavStates[index];

    return !disabled && !isAtMaximum;
  };

  return (
    <div>
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
  const disabled = getRegionEditorActive(state) || getRegionFieldActive(state);

  return {
    browserNavStates: getBrowserNavStates(state),
    disabled
  };
};

export default connect(mapStateToProps)(BrowserNavBarControls);
