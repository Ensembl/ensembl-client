import React, { FunctionComponent, useCallback } from 'react';
import { connect } from 'react-redux';

import { ChrLocation } from '../browserState';
import { BrowserInfoItem } from '../browserConfig';
import { getChrLocation, getDefaultChrLocation } from '../browserSelectors';
import { RootState } from 'src/rootReducer';

import styles from './BrowserReset.scss';

type StateProps = {
  chrLocation: ChrLocation;
  defaultChrLocation: ChrLocation;
};

type DispatchProps = {};

type OwnProps = {
  browserImageEl: HTMLDivElement;
  details: BrowserInfoItem;
};

type BrowserResetProps = StateProps & DispatchProps & OwnProps;

export const BrowserReset: FunctionComponent<BrowserResetProps> = (
  props: BrowserResetProps
) => {
  const { chrLocation, defaultChrLocation, details } = props;

  const getResetIcon = (): string => {
    if (chrLocation === defaultChrLocation) {
      return details.icon.grey as string;
    }

    return details.icon.default;
  };

  const [, startBp, endBp] = defaultChrLocation;
  const defaultMidChrLocation = startBp + (endBp - startBp) / 2;

  const navEvent = new CustomEvent('bpane', {
    bubbles: true,
    detail: {
      move_to_bp: defaultMidChrLocation
    }
  });

  const resetBrowser = useCallback(() => {
    props.browserImageEl.dispatchEvent(navEvent);
  }, [chrLocation, props.browserImageEl]);

  return (
    <dd className={styles.resetButton} onClick={resetBrowser}>
      <button>
        <img src={getResetIcon()} alt={details.description} />
      </button>
    </dd>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  chrLocation: getChrLocation(state),
  defaultChrLocation: getDefaultChrLocation(state)
});

export default connect(mapStateToProps)(BrowserReset);
