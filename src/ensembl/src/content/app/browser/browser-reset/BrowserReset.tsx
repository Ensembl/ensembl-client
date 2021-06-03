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

import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import {
  getBrowserActiveEnsObjectId,
  isFocusObjectPositionDefault
} from '../browserSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import styles from './BrowserReset.scss';
import { ReactComponent as resetIcon } from 'static/img/browser/track-reset.svg';

import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';
import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

export type BrowserResetProps = {
  focusObjectId: string | null;
  isActive: boolean;
};

export const BrowserReset: FunctionComponent<BrowserResetProps> = (
  props: BrowserResetProps
) => {
  const { focusObjectId } = props;

  const { changeFocusObject } = useGenomeBrowser();

  if (!focusObjectId) {
    return null;
  }

  const getResetIconStatus = () => {
    return props.isActive ? Status.UNSELECTED : Status.DISABLED;
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

const mapStateToProps = (state: RootState) => {
  const isFocusObjectInDefaultPosition = isFocusObjectPositionDefault(state);
  const isDrawerOpened = getIsDrawerOpened(state);
  return {
    focusObjectId: getBrowserActiveEnsObjectId(state),
    isActive: !isFocusObjectInDefaultPosition && !isDrawerOpened
  };
};

export default connect(mapStateToProps)(BrowserReset);
