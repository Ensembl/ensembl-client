import React, { useState, useRef } from 'react';
import classNames from 'classnames';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';
// import Tooltip, { Position } from 'src/shared/components/tooltip/Tooltip';

import styles from './PointerBox.stories.scss';

const VariantsStory = () => {
  const [visibleId, setVisibleId] = useState<Position | null>(null);
  const topLeftRef = useRef<HTMLDivElement>(null);
  const topRightRef = useRef<HTMLDivElement>(null);
  const rightTopRef = useRef<HTMLDivElement>(null);
  const rightBottomRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);
  const leftTopRef = useRef<HTMLDivElement>(null);
  const leftBottomRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setVisibleId(null);
  };

  return (
    <div className={styles.variantsStoryLayout}>
      <h1>Click on the dots to see the pointer box</h1>
      <div className={styles.variantsStoryContainer}>
        <div
          ref={topLeftRef}
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryTopLeft
          )}
          onClick={() => setVisibleId(Position.TOP_LEFT)}
        >
          {visibleId === Position.TOP_LEFT && topLeftRef.current && (
            <PointerBox
              anchor={topLeftRef.current}
              onClose={handleClose}
              position={Position.TOP_LEFT}
            >
              TOP LEFT
            </PointerBox>
          )}
        </div>
        <div
          ref={topRightRef}
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryTopRight
          )}
          onClick={() => setVisibleId(Position.TOP_RIGHT)}
        >
          {visibleId === Position.TOP_RIGHT && topRightRef.current && (
            <PointerBox
              anchor={topRightRef.current}
              onClose={handleClose}
              position={Position.TOP_RIGHT}
            >
              TOP RIGHT
            </PointerBox>
          )}
        </div>
        <div
          ref={rightTopRef}
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryRightTop
          )}
          onClick={() => setVisibleId(Position.RIGHT_TOP)}
        >
          {visibleId === Position.RIGHT_TOP && rightTopRef.current && (
            <PointerBox
              anchor={rightTopRef.current}
              onClose={handleClose}
              position={Position.RIGHT_TOP}
            >
              RIGHT TOP
            </PointerBox>
          )}
        </div>
        <div
          ref={rightBottomRef}
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryRightBottom
          )}
          onClick={() => setVisibleId(Position.RIGHT_BOTTOM)}
        >
          {visibleId === Position.RIGHT_BOTTOM && rightBottomRef.current && (
            <PointerBox
              anchor={rightBottomRef.current}
              onClose={handleClose}
              position={Position.RIGHT_BOTTOM}
            >
              RIGHT BOTTOM
            </PointerBox>
          )}
        </div>
        <div
          ref={bottomLeftRef}
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryBottomLeft
          )}
          onClick={() => setVisibleId(Position.BOTTOM_LEFT)}
        >
          {visibleId === Position.BOTTOM_LEFT && bottomLeftRef.current && (
            <PointerBox
              anchor={bottomLeftRef.current}
              onClose={handleClose}
              position={Position.BOTTOM_LEFT}
            >
              BOTTOM LEFT
            </PointerBox>
          )}
        </div>
        <div
          ref={bottomRightRef}
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryBottomRight
          )}
          onClick={() => setVisibleId(Position.BOTTOM_RIGHT)}
        >
          {visibleId === Position.BOTTOM_RIGHT && bottomRightRef.current && (
            <PointerBox
              anchor={bottomRightRef.current}
              onClose={handleClose}
              position={Position.BOTTOM_RIGHT}
            >
              BOTTOM RIGHT
            </PointerBox>
          )}
        </div>
        <div
          ref={leftTopRef}
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryLeftTop
          )}
          onClick={() => setVisibleId(Position.LEFT_TOP)}
        >
          {visibleId === Position.LEFT_TOP && leftTopRef.current && (
            <PointerBox
              anchor={leftTopRef.current}
              onClose={handleClose}
              position={Position.LEFT_TOP}
            >
              LEFT TOP
            </PointerBox>
          )}
        </div>
        <div
          ref={leftBottomRef}
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryLeftBottom
          )}
          onClick={() => setVisibleId(Position.LEFT_BOTTOM)}
        >
          {visibleId === Position.LEFT_BOTTOM && leftBottomRef.current && (
            <PointerBox
              anchor={leftBottomRef.current}
              onClose={handleClose}
              position={Position.LEFT_BOTTOM}
            >
              LEFT BOTTOM
            </PointerBox>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantsStory;
