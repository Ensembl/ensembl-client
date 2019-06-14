import React, { FunctionComponent, useCallback } from 'react';

import { ChrLocation } from '../browserState';
import { ReactComponent as resetIcon } from 'static/img/browser/track-reset.svg';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';

import styles from './BrowserReset.scss';
import { getChrLocationStr } from '../browserHelper';

type BrowserResetProps = {
  chrLocation: ChrLocation;
  defaultChrLocation: ChrLocation;
  dispatchBrowserLocation: (chrLocation: ChrLocation) => void;
  drawerOpened: boolean;
};

export const BrowserReset: FunctionComponent<BrowserResetProps> = (
  props: BrowserResetProps
) => {
  const { chrLocation, defaultChrLocation, drawerOpened } = props;

  const getResetIconStatus = (): ImageButtonStatus => {
    const chrLocationStr = getChrLocationStr(chrLocation);
    const defaultChrLocationStr = getChrLocationStr(defaultChrLocation);

    if (chrLocationStr === defaultChrLocationStr || drawerOpened === true) {
      return ImageButtonStatus.INACTIVE;
    }

    return ImageButtonStatus.ACTIVE;
  };

  const resetBrowser = useCallback(() => {
    if (drawerOpened === true) {
      return;
    }

    props.dispatchBrowserLocation(props.defaultChrLocation);
  }, [chrLocation, drawerOpened]);

  return (
    <dd className={styles.resetButton}>
      <div className={styles.imageWrapper}>
        <ImageButton
          buttonStatus={getResetIconStatus()}
          description={'Reset browser image'}
          image={resetIcon}
          onClick={resetBrowser}
          classNames={{ inactive: styles.imageButtonInactive }}
        />
      </div>
    </dd>
  );
};

export default BrowserReset;
