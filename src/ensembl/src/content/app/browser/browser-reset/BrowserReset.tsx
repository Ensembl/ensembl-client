import React, { FunctionComponent } from 'react';

import { ChrLocation } from '../browserState';
import { ReactComponent as resetIcon } from 'static/img/browser/track-reset.svg';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';

import styles from './BrowserReset.scss';
import { getChrLocationStr } from '../browserHelper';

type BrowserResetProps = {
  activeGenomeId: string;
  chrLocation: ChrLocation | null;
  defaultChrLocation: ChrLocation | null;
  dispatchBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  drawerOpened: { [genomeId: string]: boolean };
};

export const BrowserReset: FunctionComponent<BrowserResetProps> = (
  props: BrowserResetProps
) => {
  const {
    activeGenomeId,
    chrLocation,
    defaultChrLocation,
    drawerOpened
  } = props;

  const drawerOpenedForGenome = drawerOpened[activeGenomeId];

  const getResetIconStatus = (): ImageButtonStatus => {
    if (!(activeGenomeId && chrLocation && defaultChrLocation)) {
      return ImageButtonStatus.DISABLED;
    }

    const chrLocationStr = getChrLocationStr(chrLocation);
    const defaultChrLocationStr = getChrLocationStr(defaultChrLocation);

    if (
      chrLocationStr === defaultChrLocationStr ||
      drawerOpenedForGenome === true
    ) {
      return ImageButtonStatus.DISABLED;
    }

    return ImageButtonStatus.ACTIVE;
  };

  const resetBrowser = () => {
    if (drawerOpenedForGenome === true) {
      return;
    }

    defaultChrLocation &&
      props.dispatchBrowserLocation(
        activeGenomeId as string,
        defaultChrLocation
      );
  };

  return (
    <dd className={styles.resetButton}>
      <div className={styles.imageWrapper}>
        <ImageButton
          buttonStatus={getResetIconStatus()}
          description={'Reset browser image'}
          image={resetIcon}
          onClick={resetBrowser}
          classNames={{ disabled: styles.imageButtonDisabled }}
        />
      </div>
    </dd>
  );
};

export default BrowserReset;
