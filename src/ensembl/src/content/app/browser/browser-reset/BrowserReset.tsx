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
  getBrowserActiveEnsObject,
  isFocusObjectPositionDefault
} from '../browserSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';
import { changeFocusObject } from '../browserActions';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import styles from './BrowserReset.scss';
import { ReactComponent as resetIcon } from 'static/img/browser/track-reset.svg';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';
import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';

export type BrowserResetProps = {
  focusObject: EnsObject | null;
  changeFocusObject: (objectId: string) => void;
  isActive: boolean;
};

export const BrowserReset: FunctionComponent<BrowserResetProps> = (
  props: BrowserResetProps
) => {
  const { focusObject } = props;
  if (!focusObject) {
    return null;
  }

  const getResetIconStatus = () => {
    return props.isActive ? Status.UNSELECTED : Status.DISABLED;
  };

  const handleClick = () => {
    props.changeFocusObject(focusObject.object_id);
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
    focusObject: getBrowserActiveEnsObject(state),
    isActive: !isFocusObjectInDefaultPosition && !isDrawerOpened
  };
};

const mapDispatchToProps = {
  changeFocusObject
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowserReset);
