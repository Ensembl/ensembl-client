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

import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import { getBrowserActiveFocusObjectId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getIsDrawerOpened } from 'src/content/app/genome-browser/state/drawer/drawerSelectors';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import ResetIcon from 'static/icons/icon_reset.svg';

import { Status } from 'src/shared/types/status';

import styles from './BrowserReset.scss';

type Props = {
  className?: string;
};

export const BrowserReset = (props: Props) => {
  const isDrawerOpened = useSelector(getIsDrawerOpened);
  const focusObjectId = useSelector(getBrowserActiveFocusObjectId);
  const isActive = !isDrawerOpened;

  const { changeFocusObject } = useGenomeBrowser();
  const { trackFocusObjectReset } = useGenomeBrowserAnalytics();

  if (!focusObjectId) {
    return null;
  }

  const getResetIconStatus = () => {
    return isActive ? Status.UNSELECTED : Status.DISABLED;
  };

  const handleClick = () => {
    trackFocusObjectReset();
    changeFocusObject(focusObjectId);
  };

  return (
    <ImageButton
      status={getResetIconStatus()}
      description={'Reset browser image'}
      image={ResetIcon}
      onClick={handleClick}
      className={classNames(styles.resetButton, props.className)}
    />
  );
};

export default BrowserReset;
