import React, { useState, useRef } from 'react';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

import styles from './PointerBox.stories.scss';

const ScrollingStory = () => {
  const [showPointerBox, setShowPointerBox] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <p className={styles.scrollingStoryInfo}>
        Scrolling the page or any inner DOM nodes that contain PointerBox's
        anchor may interfere with proper positioning of the PointerBox. To test
        whether it's positioned properly, try scrolling this page or the
        container below and then clicking on the button. Try also to scroll the
        container below after clicking on the button. Ideally, PointerBox should
        be positioned properly regardless of scrolling.
      </p>
      <div className={styles.scrollingStoryContainer}>
        <div className={styles.scrollingStoryAnchorContainer}>
          <div className={styles.scrollingStoryAnchorContainerInner}>
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
              >
                Hello sailor!
              </PointerBox>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScrollingStory;
