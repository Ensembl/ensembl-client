import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import Dropdown from 'src/shared/dropdown/Dropdown';

import styles from './Dropdown.stories.scss';

const DropdownParent = () => {
  const [isVisible, setVisible] = useState(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(!isVisible);
  };

  const hideDropdown = () => setVisible(false);

  return (
    <div className={styles.item} onClick={toggleDropdown}>
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
      <div className={styles.container}>
        <DropdownParent />
      </div>
    );
  }
);
