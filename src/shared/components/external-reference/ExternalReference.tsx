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

import ExternalLink from '../external-link/ExternalLink';

import styles from './ExternalReference.scss';

export type ExternalReferenceProps = {
  label?: string | null;
  to: string;
  linkText: string;
  classNames?: {
    container?: string;
    label?: string;
    icon?: string;
    link?: string;
  };
  onClick?: () => void;
};

const ExternalReference = (props: ExternalReferenceProps) => {
  const containerClass = classNames(props.classNames?.container);
  const containerProps = containerClass
    ? {
        className: containerClass
      }
    : {};

  const labelClass = classNames(styles.label, props.classNames?.label);

  return (
    <div {...containerProps} data-test-id="external reference container">
      {!!props.label && <span className={labelClass}>{props.label}</span>}

      {props.to ? (
        <ExternalLink
          to={props.to}
          linkText={props.linkText}
          classNames={{
            icon: props.classNames?.icon,
            link: props.classNames?.link
          }}
          onClick={props.onClick}
        />
      ) : (
        <span className={styles.noLink}>{props.linkText}</span>
      )}
    </div>
  );
};

export default ExternalReference;
