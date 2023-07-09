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

import styles from './Dot.scss';

/**
 * Draws a circle filled with colour.
 * Looks like a character "●".
 * Maybe we'll be able to just use the character "●" from the font in the future.
 */

type Props = {
  className?: string;
};

const SolidDot = (props: Props) => {
  const componentClasses = classNames(styles.dotSolid, props.className);

  return <span className={componentClasses} />;
};

export default SolidDot;
