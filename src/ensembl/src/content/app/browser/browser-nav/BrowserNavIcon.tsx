/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FunctionComponent, memo } from 'react';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import { BrowserNavItem } from '../browserConfig';
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
  const { detail, icon, action } = browserNavItem;

  const navigateBrowser = () => {
    if (enabled) {
      browserMessagingService.send({ action, payload: { ...detail } });
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
