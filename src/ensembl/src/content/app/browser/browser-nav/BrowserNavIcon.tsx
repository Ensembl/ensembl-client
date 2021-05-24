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

import React, { memo, useContext } from 'react';

import { OutgoingAction } from 'src/content/app/browser/browser-messaging-service';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { GenomeBrowserServiceContext } from 'src/content/app/browser/Browser';

import { BrowserNavItem } from '../browserConfig';
import { Status } from 'src/shared/types/status';

import iconStyles from './BrowserNavIcon.scss';



type BrowserNavIconProps = {
  browserNavItem: BrowserNavItem;
  enabled: boolean;
};

export const BrowserNavIcon = (props: BrowserNavIconProps) => {
  
  const {genomeBrowserService} = useContext(GenomeBrowserServiceContext);

  if(!genomeBrowserService){
    return null;
  }
  
  const { browserNavItem, enabled } = props;
  const { icon } = browserNavItem;

  const action: OutgoingAction = {
    type: browserNavItem.name as any,
    payload: browserNavItem.detail
  } 
  const navigateBrowser = () => {
    if (enabled) {
      genomeBrowserService.send(action);
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
