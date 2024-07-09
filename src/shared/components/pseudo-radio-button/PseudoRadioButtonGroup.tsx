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

import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './PseudoRadioButtonGroup.module.css';

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * This is just a simple container with some style presets.
 * There has not yet been any designs in which the pseudo-radio buttons are positioned vertically;
 * so the only thing this container will do currently is position its children horizontally
 */

const PseudoRadioButtonGroup = (props: Props) => {
  const componentClasses = classNames(styles.container, props.className);

  return <div className={componentClasses}>{props.children}</div>;
};

export default PseudoRadioButtonGroup;
