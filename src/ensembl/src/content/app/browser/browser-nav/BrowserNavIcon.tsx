import React, { FunctionComponent, memo, useCallback } from 'react';

import { BrowserNavItem } from '../browserConfig';

import iconStyles from './BrowserNavIcon.scss';

type BrowserNavIconProps = {
  browserCanvas: HTMLElement;
  browserNavItem: BrowserNavItem;
  maxState: boolean;
};

export const BrowserNavIcon: FunctionComponent<BrowserNavIconProps> = (
  props: BrowserNavIconProps
) => {
  const { browserNavItem, browserCanvas, maxState } = props;
  const { detail, icon } = browserNavItem;

  const navEvent = new CustomEvent('bpane', {
    bubbles: true,
    detail
  });

  const navigateBrowser = useCallback(() => {
    if (maxState === false) {
      browserCanvas.dispatchEvent(navEvent);
    }
  }, [navEvent, browserCanvas]);

  const iconUrl = maxState ? icon.off : icon.on;

  return (
    <dd className={iconStyles.browserNavIcon}>
      <button title={browserNavItem.description} onClick={navigateBrowser}>
        <img src={iconUrl} alt={browserNavItem.description} />
      </button>
    </dd>
  );
};

export default memo(BrowserNavIcon);
