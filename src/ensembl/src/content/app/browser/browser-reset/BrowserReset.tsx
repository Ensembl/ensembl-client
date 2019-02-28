import React, { FunctionComponent, useCallback } from 'react';

import { ChrLocation } from '../browserState';
import { BrowserInfoItem } from '../browserConfig';

import styles from './BrowserReset.scss';
import { getChrLocationStr } from '../browserHelper';

type BrowserResetProps = {
  changeBrowserLocation: () => void;
  chrLocation: ChrLocation;
  defaultChrLocation: ChrLocation;
  details: BrowserInfoItem;
  updateChrLocation: (chrLocation: ChrLocation) => void;
};

export const BrowserReset: FunctionComponent<BrowserResetProps> = (
  props: BrowserResetProps
) => {
  const { chrLocation, defaultChrLocation, details } = props;

  const getResetIcon = (): string => {
    const chrLocationStr = getChrLocationStr(chrLocation);
    const defaultChrLocationStr = getChrLocationStr(defaultChrLocation);

    if (chrLocationStr === defaultChrLocationStr) {
      return details.icon.grey as string;
    }

    return details.icon.default;
  };

  const resetBrowser = useCallback(() => {
    props.updateChrLocation(props.defaultChrLocation);
    props.changeBrowserLocation();
  }, [chrLocation]);

  return (
    <dd className={styles.resetButton} onClick={resetBrowser}>
      <button>
        <img src={getResetIcon()} alt={details.description} />
      </button>
    </dd>
  );
};

export default BrowserReset;
