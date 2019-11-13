import React, { FunctionComponent, memo } from 'react';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import { BrowserNavItem } from '../browserConfig';

import iconStyles from './BrowserNavIcon.scss';

type BrowserNavIconProps = {
  browserNavItem: BrowserNavItem;
  enabled: boolean;
};

export const BrowserNavIcon: FunctionComponent<BrowserNavIconProps> = (
  props: BrowserNavIconProps
) => {
  const { browserNavItem, enabled } = props;
  const { detail, icon } = browserNavItem;

  const navigateBrowser = () => {
    if (enabled) {
      browserMessagingService.send('bpane', detail);
    }
  };

  const iconUrl = enabled ? icon.on : icon.off;

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
