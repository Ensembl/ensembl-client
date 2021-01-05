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

import { ReactComponent as CrossInCircleIcon } from 'static/img/shared/clear.svg';

import styles from './ClearButton.scss';

type Props = {
  inverted: boolean;
  onClick: () => void;
};

const ClearButton = (props: Props) => {
  const className = classNames(styles.clearButton, {
    [styles.clearButtonInverted]: props.inverted
  });

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    props.onClick();
  };

  return (
    <div className={className} onClick={handleClick}>
      <CrossInCircleIcon />
    </div>
  );
};

ClearButton.defaultProps = {
  inverted: false
};

export default ClearButton;
