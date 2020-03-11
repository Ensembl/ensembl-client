import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  RefForwardingComponent,
  MutableRefObject
} from 'react';
import noop from 'lodash/noop';

import { ReactComponent as CloseIcon } from 'static/img/shared/close.svg';
import { ReactComponent as DownloadIcon } from 'static/img/sidebar/download.svg';

import styles from './ToolboxExpandableContent.scss';

export type ToolboxExpandableContentHandles = {
  getIsExpanded: () => boolean;
  toggleExpanded: () => boolean
};

type ToolboxExpandableContentProps = {
  mainContent: ReactNode;
  footerContent: ReactNode;
};

type ToggleButtonProps = {
  // isOpen: boolean;
  toolboxContentHandles: ToolboxExpandableContentHandles | null
  // onClick: () => void;
};

const ToolboxExpandableContent: RefForwardingComponent<ToolboxExpandableContentHandles, ToolboxExpandableContentProps> = (props, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  console.log('before useImperativeHandle', ref);

  useImperativeHandle(ref, () => ({
    foo: () => elementRef,
    getIsExpanded: () => isExpanded,
    toggleExpanded: () => toggleExpanded()
  }), [isExpanded]);

  const toggleExpanded = () => {
    const updated = !isExpanded;
    console.log('toggling to', updated);
    setIsExpanded(updated);
    return updated;
  };

  return (
    <div ref={elementRef}>
      <div className={styles.main}>
        {props.mainContent}
      </div>
      {isExpanded && <div>{props.footerContent}</div>}
    </div>
  );
};

export const ToggleButton = (props: ToggleButtonProps) => {
  const {
    getIsExpanded = noop,
    toggleExpanded = noop
  } = props.toolboxContentHandles || {};
  console.log('props.toolboxContentHandles', props.toolboxContentHandles);
  const [isOpen, setIsOpen] = useState(getIsExpanded());

  const handleClick = () => {
    console.log(toggleExpanded);
    const isOpen = toggleExpanded();
    console.log(isOpen);
    setIsOpen(isOpen);
  }

  const Icon = isOpen ? CloseIcon : DownloadIcon;
  return (
    <div className={styles.toggleButton} onClick={handleClick}>
      <Icon />
    </div>
  );
};

export default forwardRef(ToolboxExpandableContent);
