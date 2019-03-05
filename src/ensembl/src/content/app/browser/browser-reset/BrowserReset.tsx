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
  drawerOpened: boolean;
  updateChrLocation: (chrLocation: ChrLocation) => void;
};

export const BrowserReset: FunctionComponent<BrowserResetProps> = (
  props: BrowserResetProps
) => {
  const { chrLocation, defaultChrLocation, details, drawerOpened } = props;

  const getResetIcon = (): string => {
    const chrLocationStr = getChrLocationStr(chrLocation);
    const defaultChrLocationStr = getChrLocationStr(defaultChrLocation);

    if (chrLocationStr === defaultChrLocationStr || drawerOpened === true) {
      return details.icon.grey as string;
    }

    return details.icon.default;
  };

  const resetBrowser = useCallback(() => {
    if (drawerOpened === true) {
      return;
    }

    props.updateChrLocation(props.defaultChrLocation);
    props.changeBrowserLocation();
  }, [chrLocation, drawerOpened]);

  return (
    <dd className={styles.resetButton} onClick={resetBrowser}>
      <button>
        <img src={getResetIcon()} alt={details.description} />
      </button>
    </dd>
  );
};

export default BrowserReset;
