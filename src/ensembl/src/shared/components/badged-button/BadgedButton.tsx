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
import defaultStyles from './BadgedButton.scss';
import classNames from 'classnames';

export type Props = {
  children: React.ReactChild;
  badgeContent?: string | number | undefined;
  className?: string;
};

const BadgedButton = (props: Props) => {
  const className = classNames(defaultStyles.badgeDefault, props.className);

  let badgeContent = props.badgeContent;

  if (typeof badgeContent === 'number' && badgeContent > 99) {
    badgeContent = '99+';
  } else if (typeof badgeContent === 'string') {
    // Limit the string to 3 characters
    badgeContent = badgeContent.substring(0, 3);
  }

  return (
    <div className={defaultStyles.badgedButton}>
      {props.children}
      {!!props.badgeContent && <div className={className}>{badgeContent}</div>}
    </div>
  );
};

export default BadgedButton;
