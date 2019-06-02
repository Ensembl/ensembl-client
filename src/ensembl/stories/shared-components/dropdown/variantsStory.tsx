import React, { useState } from 'react';
import classNames from 'classnames';

import Dropdown, { Position } from 'src/shared/dropdown/Dropdown';

import styles from './Dropdown.stories.scss';

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
            <Dropdown onClose={handleClose} position={Position.TOP_LEFT}>
              TOP LEFT
            </Dropdown>
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
            <Dropdown onClose={handleClose} position={Position.TOP_RIGHT}>
              TOP RIGHT
            </Dropdown>
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
            <Dropdown onClose={handleClose} position={Position.RIGHT_TOP}>
              RIGHT TOP
            </Dropdown>
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
            <Dropdown onClose={handleClose} position={Position.RIGHT_BOTTOM}>
              RIGHT BOTTOM
            </Dropdown>
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
            <Dropdown onClose={handleClose} position={Position.BOTTOM_LEFT}>
              BOTTOM LEFT
            </Dropdown>
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
            <Dropdown onClose={handleClose} position={Position.BOTTOM_RIGHT}>
              BOTTOM RIGHT
            </Dropdown>
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
            <Dropdown onClose={handleClose} position={Position.LEFT_TOP}>
              LEFT TOP
            </Dropdown>
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
            <Dropdown onClose={handleClose} position={Position.LEFT_BOTTOM}>
              LEFT BOTTOM
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantsStory;
