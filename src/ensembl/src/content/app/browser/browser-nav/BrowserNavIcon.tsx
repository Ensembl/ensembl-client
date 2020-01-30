import React, { FunctionComponent, memo } from 'react';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import { BrowserNavItem } from '../browserConfig';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import { Status } from 'src/shared/types/status';

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

  const iconStatus = enabled ? Status.DEFAULT : Status.DISABLED;

  return (
    <div className={iconStyles.browserNavIcon}>
      <ImageButton
        status={iconStatus}
        description={browserNavItem.description}
        onClick={navigateBrowser}
        image={icon}
      />
    </div>
  );
};

export default memo(BrowserNavIcon);
