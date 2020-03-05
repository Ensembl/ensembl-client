import React, { useState, useRef } from 'react';

import PointerBox, { Position } from 'src/shared/components/pointer-box/PointerBox';

import styles from './PointerBox.stories.scss';

const ScrollingStory = () => {
  const [showPointerBox, setShowPointerBox] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={styles.scrollingStoryContainer}>
      <p>
        To make sure that PointerBox correctly points at its anchor element
        even after the page has been scrolled, scroll the page then click the button.
      </p>
      <button
        ref={anchorRef}
        className={styles.scrollingStoryButton}
        onClick={() => setShowPointerBox(!showPointerBox)}
      >
        Click me
      </button>
      {showPointerBox && (
        <PointerBox
          anchor={anchorRef.current as HTMLButtonElement}
          position={Position.BOTTOM_LEFT}
          onClose={() => setShowPointerBox(false)}
        >
          Hello sailor!
        </PointerBox>
      )}
    </div>
  );
}

export default ScrollingStory;
