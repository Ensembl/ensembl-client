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

import { type ComponentProps } from 'react';
import classNames from 'classnames';

import styles from './Pill.module.css';

/**
 * Visually, this component is indistinguishable from PillButton.
 * Its default background color is also blue, as is the default colour of our clickable elements.
 * Yet, on its own, this element does not respond to clicks.
 *
 * The purpose of this element is to be included into a parent button
 * when there is also a label next to the pill;
 * and according to the design, both the pill and the label should be clickable
 */

type Props = ComponentProps<'span'>;

const Pill = (props: Props) => {
  const { className, ...otherProps } = props;

  const pillClasses = classNames(styles.pill, className);

  return <span className={pillClasses} {...otherProps} />;
};

export default Pill;
