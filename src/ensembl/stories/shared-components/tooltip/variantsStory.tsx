import React, { useState, useRef } from 'react';
import classNames from 'classnames';

import Tooltip, { Position } from 'src/shared/components/tooltip/Tooltip';

import styles from './Tooltip.stories.scss';

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
      <h1>Click on the dots to see the tooltip</h1>
      <div className={styles.variantsStoryContainer}>
        <div
          ref={topLeftRef}
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryTopLeft
          )}
          onClick={() => setVisibleId(Position.TOP_LEFT)}
        >
          {visibleId === Position.TOP_LEFT && (
            <Tooltip
              anchor={topLeftRef.current}
              delay={0}
              onClose={handleClose}
              position={Position.TOP_LEFT}
            >
              TOP LEFT
            </Tooltip>
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
          {visibleId === Position.TOP_RIGHT && (
            <Tooltip
              anchor={topRightRef.current}
              delay={0}
              onClose={handleClose}
              position={Position.TOP_RIGHT}
            >
              TOP RIGHT
            </Tooltip>
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
          {visibleId === Position.RIGHT_TOP && (
            <Tooltip
              anchor={rightTopRef.current}
              delay={0}
              onClose={handleClose}
              position={Position.RIGHT_TOP}
            >
              RIGHT TOP
            </Tooltip>
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
          {visibleId === Position.RIGHT_BOTTOM && (
            <Tooltip
              anchor={rightBottomRef.current}
              delay={0}
              onClose={handleClose}
              position={Position.RIGHT_BOTTOM}
            >
              RIGHT BOTTOM
            </Tooltip>
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
          {visibleId === Position.BOTTOM_LEFT && (
            <Tooltip
              anchor={bottomLeftRef.current}
              delay={0}
              onClose={handleClose}
              position={Position.BOTTOM_LEFT}
            >
              BOTTOM LEFT
            </Tooltip>
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
          {visibleId === Position.BOTTOM_RIGHT && (
            <Tooltip
              anchor={bottomRightRef.current}
              delay={0}
              onClose={handleClose}
              position={Position.BOTTOM_RIGHT}
            >
              BOTTOM RIGHT
            </Tooltip>
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
          {visibleId === Position.LEFT_TOP && (
            <Tooltip
              anchor={leftTopRef.current}
              delay={0}
              onClose={handleClose}
              position={Position.LEFT_TOP}
            >
              LEFT TOP
            </Tooltip>
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
          {visibleId === Position.LEFT_BOTTOM && (
            <Tooltip
              anchor={leftBottomRef.current}
              delay={0}
              onClose={handleClose}
              position={Position.LEFT_BOTTOM}
            >
              LEFT BOTTOM
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantsStory;
