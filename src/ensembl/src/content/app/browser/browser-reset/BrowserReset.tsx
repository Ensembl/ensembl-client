import React, { FunctionComponent } from 'react';

import { ChrLocation } from '../browserState';
import { ReactComponent as resetIcon } from 'static/img/browser/track-reset.svg';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';

import styles from './BrowserReset.scss';
import { getChrLocationStr } from '../browserHelper';

type BrowserResetProps = {
  activeGenomeId: string | null;
  chrLocation: ChrLocation | null;
  defaultChrLocation: ChrLocation | null;
  dispatchBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  drawerOpened: boolean;
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

  const getResetIconStatus = (): ImageButtonStatus => {
    if (!(activeGenomeId && chrLocation && defaultChrLocation)) {
      return ImageButtonStatus.DISABLED;
    }

    const chrLocationStr = getChrLocationStr(chrLocation);
    const defaultChrLocationStr = getChrLocationStr(defaultChrLocation);

    if (chrLocationStr === defaultChrLocationStr || drawerOpened === true) {
      return ImageButtonStatus.DISABLED;
    }

    return ImageButtonStatus.ACTIVE;
  };

  const resetBrowser = () => {
    if (drawerOpened === true) {
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
