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

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import { getBrowserActiveEnsObjectId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { isFocusObjectPositionDefault } from 'src/content/app/genome-browser/state/browser-location/browserLocationSelectors';
import { getIsDrawerOpened } from 'src/content/app/genome-browser/state/drawer/drawerSelectors';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as resetIcon } from 'static/img/browser/track-reset.svg';

import { Status } from 'src/shared/types/status';

import styles from './BrowserReset.scss';

export const BrowserReset = () => {
  const isFocusObjectInDefaultPosition = useSelector(
    isFocusObjectPositionDefault
  );
  const isDrawerOpened = useSelector(getIsDrawerOpened);
  const focusObjectId = useSelector(getBrowserActiveEnsObjectId);
  const isActive = !isFocusObjectInDefaultPosition && !isDrawerOpened;

  const { changeFocusObject } = useGenomeBrowser();

  if (!focusObjectId) {
    return null;
  }

  const getResetIconStatus = () => {
    return isActive ? Status.UNSELECTED : Status.DISABLED;
  };

  const handleClick = () => {
    changeFocusObject(focusObjectId);
  };

  return (
    <ImageButton
      status={getResetIconStatus()}
      description={'Reset browser image'}
      image={resetIcon}
      onClick={handleClick}
      className={styles.resetButton}
      statusClasses={{ disabled: styles.imageButtonDisabled }}
    />
  );
};

export default BrowserReset;
