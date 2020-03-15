import React, { useState, useContext, ReactNode } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import { ReactComponent as CloseIcon } from 'static/img/shared/close.svg';

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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation(); // because we want to prevent propagation to document, which is outsite React's synthetic event system
    toggleExpanded();
  }

  const button = isExpanded ? <CloseIcon /> : props.openElement;
  const buttonClasses = classNames(
    styles.toggleButton,
    props.className
  );
  return (
    <span className={buttonClasses} onClick={handleClick}>
      {button}
    </span>
  );
};

export default ToolboxExpandableContent;
