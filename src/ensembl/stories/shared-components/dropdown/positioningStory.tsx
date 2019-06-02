import React, { useState, useRef } from 'react';
import classNames from 'classnames';

import Dropdown, { Position } from 'src/shared/dropdown/Dropdown';

import styles from './Dropdown.stories.scss';

type ItemsProps = {
  container: React.RefObject<HTMLElement>;
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
  const [showTooltip, setShowTooltip] = useState(false);

  const className = classNames(styles.positioningStoryItem, props.className);

  return (
    <div className={className} onClick={() => setShowTooltip(!showTooltip)}>
      Click me
      {showTooltip && (
        <Dropdown
          onClose={() => setShowTooltip(false)}
          position={props.position}
          container={props.container.current}
          autoAdjust={true}
        >
          Hello sailor!
        </Dropdown>
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
  const positions = [];
  for (const position in Position) {
    positions.push(position);
  }
  const positionOptions = positions.map((position: any) => (
    <option value={Position[position]} key={position}>
      {position}
    </option>
  ));

  return (
    <div className={styles.positioningStorySelector}>
      <select
        onChange={(e) => props.onChange(e.target.value as Position)}
        value={props.selectedPosition}
      >
        {positionOptions}
      </select>
    </div>
  );
};

const PositioningStory = () => {
  const [position, setPosition] = useState(Position.BOTTOM_LEFT);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.positioningStoryLayout}>
      <h1>Auto-positioning of the tooltip</h1>
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
