import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { browserNavConfig, BrowserNavItem } from '../browserConfig';

import { RootState } from 'src/rootReducer';
import { getBrowserNavStates } from '../browserSelectors';
import { BrowserNavStates } from '../browserState';

import BrowserNavIcon from './BrowserNavIcon';

import styles from './BrowserNavBar.scss';
import imageStyles from '../browser-image/BrowserImage.scss';

type StateProps = {
  browserNavStates: BrowserNavStates;
};

type DispatchProps = {};

type OwnProps = {};

type BrowserNavBarProps = StateProps & DispatchProps & OwnProps;

export const BrowserNavBar: FunctionComponent<BrowserNavBarProps> = (
  props: BrowserNavBarProps
) => {
  const browserCanvas = document.querySelector(
    `.${imageStyles.browserStage}`
  ) as HTMLElement;

  return (
    <div className={styles.browserNavBar}>
      <dl>
        {browserNavConfig.map((item: BrowserNavItem, index: number) => (
          <BrowserNavIcon
            key={item.name}
            browserNavItem={item}
            browserCanvas={browserCanvas}
            maxState={props.browserNavStates[index]}
          />
        ))}
      </dl>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserNavStates: getBrowserNavStates(state)
});

const mapDispatchToProps: DispatchProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserNavBar);
