import React, { useState, useRef, useEffect } from 'react';
import { storiesOf } from '@storybook/react';

import Dropdown from 'src/shared/dropdown/Dropdown';

type DropdownParentElementState = HTMLElement | null;

const DropdownParent = () => {
  const [element, setElement] = useState<DropdownParentElementState>(null);
  const [isVisible, setVisible] = useState(false);
  const parentRef: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (parentRef.current) {
      setElement(parentRef.current);
    }
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(!isVisible);
  };

  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as 'relative',
    marginLeft: '100px',
    width: '100px',
    height: '100px',
    border: '1px solid gray',
    backgroundColor: 'lightgray',
    userSelect: 'none' as 'none',
    cursor: 'pointer'
  };

  return (
    <div ref={parentRef} style={styles} onClick={toggleDropdown}>
      Click me
      {element && isVisible && (
        <Dropdown parent={element} verticalOffset={-5}>
          <DropdownContent />
        </Dropdown>
      )}
    </div>
  );
};

const DropdownContent = () => (
  <div style={{ width: '300px' }}>This is sample dropdown content</div>
);

storiesOf('Components|Shared Components/Dropdown', module).add(
  'default',
  () => {
    return (
      <div>
        <DropdownParent />
      </div>
    );
  }
);
