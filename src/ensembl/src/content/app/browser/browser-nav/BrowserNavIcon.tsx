import React, { FunctionComponent, memo } from 'react';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import { BrowserNavItem } from '../browserConfig';

import iconStyles from './BrowserNavIcon.scss';

type BrowserNavIconProps = {
  browserNavItem: BrowserNavItem;
  maxState: boolean;
};

export const BrowserNavIcon: FunctionComponent<BrowserNavIconProps> = (
  props: BrowserNavIconProps
) => {
  const { browserNavItem, maxState } = props;
  const { detail, icon } = browserNavItem;

  const navigateBrowser = () => {
    if (maxState === false) {
      browserMessagingService.send('bpane', detail);
    }
  };

  const iconUrl = maxState ? icon.off : icon.on;

  return (
    <button
      className={iconStyles.browserNavIcon}
      title={browserNavItem.description}
      onClick={navigateBrowser}
    >
      <img src={iconUrl} alt={browserNavItem.description} />
    </button>
  );
};

export default memo(BrowserNavIcon);
