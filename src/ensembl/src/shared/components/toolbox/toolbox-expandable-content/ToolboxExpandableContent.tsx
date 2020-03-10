import React, { useState, ReactNode } from 'react';

import { ReactComponent as CloseIcon } from 'static/img/shared/close.svg';
import { ReactComponent as DownloadIcon } from 'static/img/sidebar/download.svg';

import styles from './ToolboxExpandableContent.scss';

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
      <div className={styles.main}>
        {props.mainContent}
        <ToggleButton isOpen={isExpanded} onClick={toggleExpanded} />
      </div>
      {isExpanded && <div>{props.footerContent}</div>}
    </div>
  );
};

const ToggleButton = (props: ToggleButtonProps) => {
  const Icon = props.isOpen ? CloseIcon : DownloadIcon;
  return (
    <div className={styles.toggleButton} onClick={props.onClick}>
      <Icon />
    </div>
  );
};

export default HoverboxExpandableContent;
