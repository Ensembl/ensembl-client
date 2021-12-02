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
import classNames from 'classnames';

// the shared close.svg file in static/img/shared folder has inline style with fill
// TODO: consider moving the close.svg imported below back to shared folder when all our components use the CloseButton consistently
import { ReactComponent as CloseIcon } from './close.svg';

import styles from './CloseButton.scss';

type Props = {
  onClick: () => void;
  className?: string;
};

const CloseButton = (props: Props) => {
  const className = classNames(styles.closeButton, props.className);
  return (
    <div className={className} onClick={props.onClick}>
      <CloseIcon className={styles.icon} />
    </div>
  );
};

export default CloseButton;
