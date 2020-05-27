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
import classNamesMerger from 'classnames';

import closeIcon from 'static/img/shared/close.svg';

import styles from './Panel.scss';

export type PanelProps = {
  header: string | JSX.Element;
  children: JSX.Element;
  classNames?: {
    panel?: string;
    header?: string;
    body?: string;
    closeButton?: string;
  };
  onClose?: () => void;
};

const Panel = (props: PanelProps) => {
  const { header, onClose, classNames } = props;

  const panelClassNames = classNames
    ? classNamesMerger(styles.panel, classNames.panel)
    : styles.panel;
  const headerClassNames = classNames
    ? classNamesMerger(styles.header, classNames.header)
    : styles.header;
  const bodyClassNames = classNames
    ? classNamesMerger(styles.body, classNames.body)
    : styles.body;

  const closeButtonClassNames = classNames
    ? classNamesMerger(styles.closeButton, classNames.closeButton)
    : styles.closeButton;

  return (
    <div className={panelClassNames}>
      {onClose && (
        <span className={closeButtonClassNames} onClick={onClose}>
          <img src={closeIcon}></img>
        </span>
      )}
      <div className={headerClassNames}>{header}</div>
      <div className={bodyClassNames}>
        <div>{props.children}</div>
      </div>
    </div>
  );
};

export default Panel;
