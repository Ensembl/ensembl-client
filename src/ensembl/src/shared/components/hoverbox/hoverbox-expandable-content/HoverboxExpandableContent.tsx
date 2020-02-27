import React, { useState, ReactNode } from 'react';

import styles from './HoverboxExpandableContent.scss';

type HoverboxExpandableContentProps = {
  mainContent: ReactNode;
  footerContent: ReactNode;
};

type ToggleButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

const HoverboxExpandableContent = (props: HoverboxExpandableContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div>{props.mainContent}</div>
      <ToggleButton isOpen={isExpanded} onClick={toggleExpanded} />
      {isExpanded && <div>{props.footerContent}</div>}
    </div>
  );
};

const ToggleButton = (props: ToggleButtonProps) => {
  return (
    <div className={styles.toggleButton} onClick={props.onClick}>
      Toggle Button
    </div>
  );
};

export default HoverboxExpandableContent;
