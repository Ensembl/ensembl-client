/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState, useRef, type RefObject } from 'react';
import classNames from 'classnames';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

import styles from './PointerBox.stories.module.css';

type ItemsProps = {
  container: RefObject<HTMLElement>;
  position: Position;
};

type ItemProps = ItemsProps & {
  className: string;
};

type PositionsProps = {
  selectedPosition: Position;
  onChange: (position: Position) => void;
};

const Item = (props: ItemProps) => {
  const [showPointerBox, setShowPointerBox] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const className = classNames(styles.positioningStoryItem, props.className);

  return (
    <div
      ref={anchorRef}
      className={className}
      onClick={() => setShowPointerBox(!showPointerBox)}
    >
      Click me
      {showPointerBox && (
        <PointerBox
          anchor={anchorRef.current as HTMLDivElement}
          onOutsideClick={() => setShowPointerBox(false)}
          position={props.position}
          container={props.container.current}
          autoAdjust={true}
          className={styles.pointerBox}
          pointerOffset={5}
        >
          Hello sailor!
        </PointerBox>
      )}
    </div>
  );
};

const Items = (props: ItemsProps) => {
  return (
    <>
      <Item {...props} className={styles.positioningStoryItemTopLeft} />
      <Item {...props} className={styles.positioningStoryItemTopRight} />
      <Item {...props} className={styles.positioningStoryItemBottomLeft} />
      <Item {...props} className={styles.positioningStoryItemBottomRight} />
      <Item {...props} className={styles.positioningStoryItemCenter} />
    </>
  );
};

const Positions = (props: PositionsProps) => {
  const positions: Array<keyof typeof Position> = [];
  for (const position in Position) {
    positions.push(position as keyof typeof Position);
  }
  const positionOptions = positions.map((position) => (
    <option value={Position[position]} key={position}>
      {position}
    </option>
  ));

  return (
    <>
      <span>Select pointer box position: </span>
      <div className={styles.positioningStorySelector}>
        <select
          onChange={(e) => props.onChange(e.target.value as Position)}
          value={props.selectedPosition}
        >
          {positionOptions}
        </select>
      </div>
    </>
  );
};

const PositioningStory = () => {
  const [position, setPosition] = useState(Position.BOTTOM_LEFT);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.positioningStoryLayout}>
      <h1>Auto-positioning of the pointer box</h1>
      <div ref={containerRef} className={styles.positioningStoryContainer}>
        <Items container={containerRef} position={position} />
      </div>
      <Positions
        selectedPosition={position}
        onChange={(newPosition) => setPosition(newPosition)}
      />
    </div>
  );
};

export default PositioningStory;
