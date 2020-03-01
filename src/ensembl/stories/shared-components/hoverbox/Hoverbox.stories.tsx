import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';

import {
  Hoverbox,
  HoverboxExpandableContent
} from 'src/shared/components/hoverbox';

import styles from './Hoverbox.stories.scss';

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
        <Hoverbox anchor={buttonRef.current}>
          <HoverboxExpandableContent
            mainContent={mainHoverboxContent}
            footerContent={hoverboxFooterContent}
          />
        </Hoverbox>
      )}
    </div>
  );
};

storiesOf('Components|Shared Components/Hoverbox', module).add(
  'default',
  DefaultStory
);
