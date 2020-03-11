import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';

import {
  Toolbox,
  ToolboxExpandableContent,
  ToggleButton as ToolboxToggleButton
} from 'src/shared/components/toolbox';

import styles from './Toolbox.stories.scss';

const DefaultStory = () => {
  const [isShowing, setIsShowing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleToolbox = () => {
    setIsShowing(!isShowing);
  };

  const mainToolboxContent = (
    <div className={styles.mainToolboxContent}>
      <p>This is main toolbox content</p>
      <p>
        This is the second paragraph
        <span className={styles.toggleButton}>
          <ToolboxToggleButton />
        </span>
      </p>
    </div>
  );

  const toolboxFooterContent = (
    <div className={styles.footerToolboxContent}>
      <p>This is footer content</p>
      <p>This is footer second paragraph</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={toggleToolbox} ref={buttonRef}>
        Click me
      </button>
      {isShowing && buttonRef.current && (
        <Toolbox anchor={buttonRef.current}>
          <ToolboxExpandableContent
            mainContent={mainToolboxContent}
            footerContent={toolboxFooterContent}
          />
        </Toolbox>
      )}
    </div>
  );
};

storiesOf('Components|Shared Components/Toolbox', module).add(
  'default',
  DefaultStory
);
