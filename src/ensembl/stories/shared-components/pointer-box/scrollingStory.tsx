import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

import styles from './PointerBox.stories.scss';

const ScrollingStory = () => {
  const [showPointerBox, setShowPointerBox] = useState(false);
  const [renderingTarget, setRenderingTarget] = useState(RenderingTarget.BODY);
  const anchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setShowPointerBox(false);
  }, [renderingTarget]);

  return (
    <div className={styles.scrollingStoryContainer}>
      <div className={styles.scrollingStoryHeader}>
        <Info target={renderingTarget} />
        <RenderingSwitch
          target={renderingTarget}
          onChange={setRenderingTarget}
        />
      </div>
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
              onClose={() => setShowPointerBox(false)}
              renderInsideAnchor={renderingTarget === RenderingTarget.ANCHOR}
              classNames={{
                body: styles.pointerBox,
                pointer: styles.pointerBoxPointer
              }}
            >
              Hello sailor!
            </PointerBox>
          )}
        </div>
      </div>
    </div>
  );
};

enum RenderingTarget {
  BODY = 'body',
  ANCHOR = 'anchor'
}

type RenderingSwitchProps = {
  target: RenderingTarget;
  onChange: (target: RenderingTarget) => void;
};

const RenderingSwitch = (props: RenderingSwitchProps) => {
  const targets = [RenderingTarget.BODY, RenderingTarget.ANCHOR];
  const texts = ['Render into body', 'Render into anchor'];

  const switchItems = targets.map((target, index) => {
    const classes = classNames(styles.renderSwitchItem, {
      [styles.renderSwitchItemActive]: target === props.target
    });

    return (
      <span
        key={index}
        className={classes}
        onClick={() => props.onChange(target)}
      >
        {texts[index]}
      </span>
    );
  });

  return <div className={styles.renderSwitch}>{switchItems}</div>;
};

const Info = (props: { target: RenderingTarget }) => {
  const text =
    props.target === RenderingTarget.BODY
      ? `Scroll the page and click the button — PointerBox will disappear on scroll`
      : `Scroll the page and click the button — PointerBox will remain correctly positioned while scrolling`;

  return <p>{text}</p>;
};

export default ScrollingStory;
