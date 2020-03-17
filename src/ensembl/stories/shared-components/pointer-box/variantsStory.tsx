import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import faker from 'faker';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

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
              onOutsideClick={handleClose}
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
              onOutsideClick={handleClose}
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
          onClick={() => setVisibleId(Position.RIGHT_BOTTOM)}
        >
          {visibleId === Position.RIGHT_BOTTOM && rightTopRef.current && (
            <PointerBox
              anchor={rightTopRef.current}
              onOutsideClick={handleClose}
              position={Position.RIGHT_BOTTOM}
            >
              <p>RIGHT BOTTOM (grows down)</p>
              <p>{faker.lorem.paragraph()}</p>
            </PointerBox>
          )}
        </div>
        <div
          ref={rightBottomRef}
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryRightBottom
          )}
          onClick={() => setVisibleId(Position.RIGHT_TOP)}
        >
          {visibleId === Position.RIGHT_TOP && rightBottomRef.current && (
            <PointerBox
              anchor={rightBottomRef.current}
              onOutsideClick={handleClose}
              position={Position.RIGHT_TOP}
            >
              <p>RIGHT TOP (grows up)</p>
              <p>{faker.lorem.sentence()}</p>
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
              onOutsideClick={handleClose}
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
              onOutsideClick={handleClose}
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
          onClick={() => setVisibleId(Position.LEFT_BOTTOM)}
        >
          {visibleId === Position.LEFT_BOTTOM && leftTopRef.current && (
            <PointerBox
              anchor={leftTopRef.current}
              onOutsideClick={handleClose}
              position={Position.LEFT_BOTTOM}
            >
              <p>LEFT TOP (grows up)</p>
              <p>{faker.lorem.sentence()}</p>
            </PointerBox>
          )}
        </div>
        <div
          ref={leftBottomRef}
          className={classNames(
            styles.variantsStoryAnchor,
            styles.variantsStoryLeftBottom
          )}
          onClick={() => setVisibleId(Position.LEFT_TOP)}
        >
          {visibleId === Position.LEFT_TOP && leftBottomRef.current && (
            <PointerBox
              anchor={leftBottomRef.current}
              onOutsideClick={handleClose}
              position={Position.LEFT_TOP}
            >
              <p>LEFT BOTTOM (grows down)</p>
              <p>{faker.lorem.sentence()}</p>
            </PointerBox>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantsStory;
