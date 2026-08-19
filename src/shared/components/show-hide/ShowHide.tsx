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
import type { ReactNode, ButtonHTMLAttributes } from 'react';

import Chevron from '../chevron/Chevron';

import styles from './ShowHide.module.css';

/**
 * A ShowHide component is a text with a chevron next to it.
 * When the chevron is pointing downward, the additional content
 * that is supposed to be associated with this ShowHide control is expected to be hidden;
 * whereas when the chevron is pointing upwards, the additional content
 * is expected to be shown.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: ReactNode;
  isExpanded: boolean;
  onClick: () => void;
};

const ShowHide = (props: Props) => {
  const {
    label,
    isExpanded,
    onClick,
    className: classNameFromProps,
    ...otherProps
  } = props;

  const wrapperClasses = classNames(styles.showHide, classNameFromProps);

  return (
    <button onClick={onClick} className={wrapperClasses} {...otherProps}>
      {label && <span className={styles.label}>{label}</span>}
      <Chevron
        direction={isExpanded ? 'up' : 'down'}
        animate={true}
        className={styles.chevron}
      />
    </button>
  );
};

export default ShowHide;
