import React, { FunctionComponent, memo, useCallback } from 'react';

import { BrowserNavItem } from '../browserConfig';

import iconStyles from './BrowserNavIcon.scss';

type BrowserNavIconProps = {
  browserImageEl: HTMLDivElement;
  browserNavItem: BrowserNavItem;
  maxState: boolean;
};

export const BrowserNavIcon: FunctionComponent<BrowserNavIconProps> = (
  props: BrowserNavIconProps
) => {
  const { browserImageEl, browserNavItem, maxState } = props;
  const { detail, icon } = browserNavItem;

  const navEvent = new CustomEvent('bpane', {
    bubbles: true,
    detail
  });

  const navigateBrowser = useCallback(() => {
    if (maxState === false) {
      browserImageEl.dispatchEvent(navEvent);
    }
  }, [maxState, browserImageEl]);

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
