import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';

import {
  Toolbox,
  ToolboxExpandableContent
} from 'src/shared/components/toolbox';

import styles from './Toolbox.stories.scss';

const DefaultStory = () => {
  const [isShowing, setIsShowing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleHoverbox = () => {
    setIsShowing(!isShowing);
  };

  const mainHoverboxContent = (
    <div>
      <p>This is main hoverbox content</p>
      <p>This is the second paragraph</p>
    </div>
  );

  const hoverboxFooterContent = (
    <div>
      <p>This is footer content</p>
      <p>This is footer second paragraph</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={toggleHoverbox}
        ref={buttonRef}
      >
        Click me
      </button>
      {isShowing && buttonRef.current && (
        <Toolbox anchor={buttonRef.current}>
          <ToolboxExpandableContent
            mainContent={mainHoverboxContent}
            footerContent={hoverboxFooterContent}
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
