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
import noop from 'lodash/noop';
import classNames from 'classnames';

import ShowHide from 'src/shared/components/show-hide/ShowHide';

import styles from './ToolboxExpandableContent.scss';

export type ToolboxContext = {
  toggleExpanded: () => void;
  isExpanded: boolean;
};

type ToolboxExpandableContentProps = {
  mainContent: ReactNode;
  footerContent: ReactNode;
  className?: string;
};

type ToggleButtonProps = {
  className?: string;
  label: string;
};

const ToolboxExpandableContentContext =
  React.createContext<ToolboxContext | null>(null);

const ToolboxExpandableContent = (props: ToolboxExpandableContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    const updated = !isExpanded;
    setIsExpanded(updated);
  };

  const wrapperClasses = classNames(styles.main, props.className);

  return (
    <ToolboxExpandableContentContext.Provider
      value={{ toggleExpanded, isExpanded }}
    >
      <div>
        <div className={wrapperClasses}>{props.mainContent}</div>
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

  return (
    <ShowHide
      label={props.label}
      onClick={handleClick}
      isExpanded={isExpanded}
    />
  );
};

export default ToolboxExpandableContent;
