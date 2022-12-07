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

import React, { memo } from 'react';
import { OutgoingAction } from '@ensembl/ensembl-genome-browser';
import classNames from 'classnames';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import { browserNavIconActionMap } from 'src/content/app/genome-browser/state/browser-nav/browserNavSlice';

import { BrowserNavItem } from 'src/content/app/genome-browser/components/browser-nav/browserNavConfig';
import { Status } from 'src/shared/types/status';

import iconStyles from './BrowserNavIcon.scss';

type BrowserNavIconProps = {
  browserNavItem: BrowserNavItem;
  enabled: boolean;
  className?: string;
};

export const BrowserNavIcon = (props: BrowserNavIconProps) => {
  const { genomeBrowser } = useGenomeBrowser();

  if (!genomeBrowser) {
    return null;
  }

  const { browserNavItem, enabled } = props;
  const { icon } = browserNavItem;

  const action = {
    type: browserNavIconActionMap[browserNavItem.name],
    payload: browserNavItem.detail
  } as OutgoingAction;

  const navigateBrowser = () => {
    if (enabled) {
      genomeBrowser.send(action);
    }
  };

  const iconStatus = enabled ? Status.DEFAULT : Status.DISABLED;

  return (
    <div className={classNames(iconStyles.browserNavIcon, props.className)}>
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
