import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import Dropdown from 'src/shared/dropdown/Dropdown';

const DropdownParent = () => {
  const [isVisible, setVisible] = useState(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(!isVisible);
  };

  const hideDropdown = () => setVisible(false);

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
    <div style={styles} onClick={toggleDropdown}>
      Click me
      {isVisible && (
        <Dropdown onClose={hideDropdown} verticalOffset={-5}>
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
