import React, { useState } from 'react';
import classNames from 'classnames';

import Tooltip, { Position } from 'src/shared/tooltip/Tooltip';

import styles from './Tooltip.stories.scss';

const VariantsStory = () => {
  const [visibleId, setVisibleId] = useState<Position | null>(null);

  const handleClose = () => {
    setVisibleId(null);
  };

  return (
    <div className={styles.variantsStoryLayout}>
      <h1>Click on the dots to see the tooltip</h1>
      <div className={styles.variantsStoryContainer}>
        <div
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryTopLeft
          )}
          onClick={() => setVisibleId(Position.TOP_LEFT)}
        >
          {visibleId === Position.TOP_LEFT && (
            <Tooltip
              delay={0}
              onClose={handleClose}
              position={Position.TOP_LEFT}
            >
              TOP LEFT
            </Tooltip>
          )}
        </div>
        <div
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryTopRight
          )}
          onClick={() => setVisibleId(Position.TOP_RIGHT)}
        >
          {visibleId === Position.TOP_RIGHT && (
            <Tooltip
              delay={0}
              onClose={handleClose}
              position={Position.TOP_RIGHT}
            >
              TOP RIGHT
            </Tooltip>
          )}
        </div>
        <div
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryRightTop
          )}
          onClick={() => setVisibleId(Position.RIGHT_TOP)}
        >
          {visibleId === Position.RIGHT_TOP && (
            <Tooltip
              delay={0}
              onClose={handleClose}
              position={Position.RIGHT_TOP}
            >
              RIGHT TOP
            </Tooltip>
          )}
        </div>
        <div
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryRightBottom
          )}
          onClick={() => setVisibleId(Position.RIGHT_BOTTOM)}
        >
          {visibleId === Position.RIGHT_BOTTOM && (
            <Tooltip
              delay={0}
              onClose={handleClose}
              position={Position.RIGHT_BOTTOM}
            >
              RIGHT BOTTOM
            </Tooltip>
          )}
        </div>
        <div
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryBottomLeft
          )}
          onClick={() => setVisibleId(Position.BOTTOM_LEFT)}
        >
          {visibleId === Position.BOTTOM_LEFT && (
            <Tooltip
              delay={0}
              onClose={handleClose}
              position={Position.BOTTOM_LEFT}
            >
              BOTTOM LEFT
            </Tooltip>
          )}
        </div>
        <div
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryBottomRight
          )}
          onClick={() => setVisibleId(Position.BOTTOM_RIGHT)}
        >
          {visibleId === Position.BOTTOM_RIGHT && (
            <Tooltip
              delay={0}
              onClose={handleClose}
              position={Position.BOTTOM_RIGHT}
            >
              BOTTOM RIGHT
            </Tooltip>
          )}
        </div>
        <div
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryLeftTop
          )}
          onClick={() => setVisibleId(Position.LEFT_TOP)}
        >
          {visibleId === Position.LEFT_TOP && (
            <Tooltip
              delay={0}
              onClose={handleClose}
              position={Position.LEFT_TOP}
            >
              LEFT TOP
            </Tooltip>
          )}
        </div>
        <div
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryLeftBottom
          )}
          onClick={() => setVisibleId(Position.LEFT_BOTTOM)}
        >
          {visibleId === Position.LEFT_BOTTOM && (
            <Tooltip
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
