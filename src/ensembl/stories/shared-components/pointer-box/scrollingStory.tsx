import React, { useState, useRef } from 'react';

import PointerBox, { Position } from 'src/shared/components/pointer-box/PointerBox';

import styles from './PointerBox.stories.scss';

const ScrollingStory = () => {
  const [showPointerBox, setShowPointerBox] = useState(false);
  const [renderingTarget, setRenderingTarget] = useState(RenderingTarget.BODY);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={styles.scrollingStoryContainer}>
      <div className={styles.scrollingStoryAnchorContainer}>
        <div className={styles.scrollingStoryAnchorHeader}>
          <p>
            To make sure that PointerBox correctly points at its anchor element
            even after the page has been scrolled, scroll the page then click the button.
          </p>
          <RenderingSwitch target={renderingTarget} onChange={setRenderingTarget}/>
        </div>
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
              onClose={() => setShowPointerBox(false)}
              renderInsideAnchor={renderingTarget === RenderingTarget.ANCHOR}
            >
              Hello sailor!
            </PointerBox>
          )}
        </div>
      </div>
    </div>
  );
}

enum RenderingTarget {
  BODY = 'body',
  ANCHOR = 'anchor'
};

type RenderingSwitchProps = {
  target: RenderingTarget;
  onChange: (target: RenderingTarget) => void;
};

const RenderingSwitch = (props: RenderingSwitchProps) => {
  return (
    <div>
      <span onClick={() => props.onChange(RenderingTarget.BODY)}>Render into body</span>
      <span onClick={() => props.onChange(RenderingTarget.ANCHOR)}>Render into anchor</span>
    </div>
  )
}

export default ScrollingStory;
