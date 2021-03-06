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

import React, { useState, useContext, ReactNode } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './ToolboxExpandableContent.scss';

export type ToolboxContext = {
  toggleExpanded: () => void;
  isExpanded: boolean;
};

type ToolboxExpandableContentProps = {
  mainContent: ReactNode;
  footerContent: ReactNode;
};

type ToggleButtonProps = {
  className?: string;
  openElement: ReactNode;
};

const ToolboxExpandableContentContext = React.createContext<ToolboxContext | null>(
  null
);

const ToolboxExpandableContent = (props: ToolboxExpandableContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    const updated = !isExpanded;
    setIsExpanded(updated);
  };

  return (
    <ToolboxExpandableContentContext.Provider
      value={{ toggleExpanded, isExpanded }}
    >
      <div>
        <div className={styles.main}>{props.mainContent}</div>
        {isExpanded && <div>{props.footerContent}</div>}
      </div>
    </ToolboxExpandableContentContext.Provider>
  );
};

export const ToggleButton = (props: ToggleButtonProps) => {
  const { toggleExpanded = noop, isExpanded = false } =
    useContext(ToolboxExpandableContentContext) || {};

  const handleClick = () => {
    toggleExpanded();
  };

  const buttonClasses = classNames(styles.toggleButton, props.className);
  return isExpanded ? (
    <CloseButton className={buttonClasses} onClick={handleClick} />
  ) : (
    <span className={buttonClasses} onClick={handleClick}>
      {props.openElement}
    </span>
  );
};

export default ToolboxExpandableContent;
