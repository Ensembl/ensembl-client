import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';

import Dropdown, { Position } from 'src/shared/dropdown/Dropdown';

import styles from './Dropdown.stories.scss';

const DropdownParent = () => {
  const [isVisible, setVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(!isVisible);
  };

  const hideDropdown = () => setVisible(false);

  return (
    <div ref={elementRef} className={styles.item} onClick={toggleDropdown}>
      Click me
      {isVisible && (
        <Dropdown
          onClose={hideDropdown}
          container={elementRef.current && elementRef.current.parentElement}
          verticalOffset={-5}
          position={Position.TOP_RIGHT}
        >
          <DropdownContent />
        </Dropdown>
      )}
    </div>
  );
};

const DropdownContent = () => <div>This is sample dropdown content</div>;

storiesOf('Components|Shared Components/Dropdown', module).add(
  'default',
  () => {
    return (
      <div className={styles.container}>
        <DropdownParent />
      </div>
    );
  }
);
