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

import Chevron from '../chevron/Chevron';

import styles from './ShowHide.scss';

/**
 * A ShowHide component is a text with a chevron next to it.
 * When the chevron is pointing downward, the additional content
 * that is supposed to be associated with this ShowHide control is expected to be hidden;
 * whereas when the chevron is pointing upwards, the additional content
 * is expected to be shown.
 */

type Props = {
  label: string | JSX.Element;
  isExpanded: boolean;
  onClick: () => void;
  classNames?: {
    wrapper?: string;
    label?: string;
    chevron?: string;
  };
};

const ShowHide = (props: Props) => {
  const labelClasses = classNames(styles.label, props.classNames?.label);

  const chevronClasses = {
    svg: classNames(styles.chevron, props.classNames?.chevron)
  };

  return (
    <div className={props.classNames?.wrapper}>
      <span onClick={props.onClick} className={labelClasses}>
        {props.label}
        <Chevron
          direction={props.isExpanded ? 'up' : 'down'}
          animate={true}
          classNames={chevronClasses}
        />
      </span>
    </div>
  );
};

export default ShowHide;
