import React, { FunctionComponent, memo } from 'react';

import { BrowserNavItem } from '../browserConfig';

import iconStyles from './BrowserNavIcon.scss';
import imageStyles from '../browser-image/BrowserImage.scss';

type BrowserNavIconProps = {
  browserNavItem: BrowserNavItem;
};

export const BrowserNavIcon: FunctionComponent<BrowserNavIconProps> = (
  props: BrowserNavIconProps
) => {
  const navigateBrowser = () => {
    const { detail } = props.browserNavItem;

    const navEvent = new CustomEvent('bpane', {
      bubbles: true,
      detail
    });

    const browserCanvas = document.querySelector(
      `.${imageStyles.browserStage}`
    ) as HTMLElement;

    browserCanvas.dispatchEvent(navEvent);
  };

  const { browserNavItem } = props;

  return (
    <dd className={iconStyles.browserNavIcon}>
      <button title={browserNavItem.description} onClick={navigateBrowser}>
        <img src={browserNavItem.icon.on} alt={browserNavItem.description} />
      </button>
    </dd>
  );
};

export default memo(BrowserNavIcon);
