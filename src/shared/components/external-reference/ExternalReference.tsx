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

import React, { type ReactNode } from 'react';

import ExternalLink from '../external-link/ExternalLink';

import styles from './ExternalReference.module.css';

export type ExternalReferenceProps = {
  label?: string | null;
  to?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

const ExternalReference = (props: ExternalReferenceProps) => {
  return (
    <div
      className={props.className}
      data-test-id="external reference container"
    >
      {!!props.label && <span className={styles.label}>{props.label}</span>}

      {props.to ? (
        <ExternalLink to={props.to} onClick={props.onClick}>
          {props.children}
        </ExternalLink>
      ) : (
        <span className={styles.noLink}>{props.children}</span>
      )}
    </div>
  );
};

export default ExternalReference;
