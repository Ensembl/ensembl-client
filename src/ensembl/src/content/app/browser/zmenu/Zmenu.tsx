import React from 'react';

import styles from './Zmenu.scss';

import {
  ZmenuData,
  AnchorCoordinates
} from './zmenu-types';

const TIP_WIDTH = 18;
const TIP_HEIGHT = 13;
const TIP_OFFSET = 20;

enum Direction {
  LEFT = 'left',
  RIGHT = 'right'
};

type Props = ZmenuData & {
  browserRef: React.RefObject<HTMLDivElement>;
  onEnter: () => void;
  onLeave: () => void;
};

type InlineStyles = { [key: string]: string | number | undefined };
type TipProps = {
  direction: Direction; // where the tip is pointing
  style: InlineStyles;
};

type GetInlineStylesParams = {
  direction: Direction,
  anchorCoordinates: AnchorCoordinates
};

const Zmenu = (props: Props) => {
  // const direction = chooseDirection(props);
  const direction = Direction.RIGHT; // FIXME - delete in favour of previous line
  const inlineStyles = getInlineStyles({
    direction,
    anchorCoordinates: props.anchor_coordinates
  });

  return (
    <div
      className={styles.zmenu}
      style={inlineStyles.body}
    >
      I am zmenu
      <Tip
        direction={getInverseDirection(direction)}
        style={inlineStyles.tip}
      />
    </div>
  );
};

// choose how to position zmenu relative to its anchor point
const chooseDirection = (params: Props) => {
  const browserElement = params.browserRef.current as HTMLDivElement;
  const { width } = browserElement.getBoundingClientRect();
  const { x } = params.anchor_coordinates;
  return x > width / 2 ? Direction.LEFT : Direction.RIGHT;
};

const getInlineStyles = (params: GetInlineStylesParams) => {
  const { direction, anchorCoordinates } = params;
  if (direction === Direction.LEFT) {
    return {
      body: { // body is to the left of the anchor point
        left: `${anchorCoordinates.x - TIP_HEIGHT}px`,
        transform: `translateX(-100%)`,
        top: `${anchorCoordinates.y - TIP_OFFSET - TIP_WIDTH / 2}px`
      },
      tip: { // tip is on the right side of the body and points to the right
        right: `-${TIP_HEIGHT}px`,
        top: `${TIP_OFFSET}px`,
        width: `${TIP_HEIGHT}px`,
        height: `${TIP_WIDTH}px`
      }
    }
  } else { // Direction.RIGHT
    return {
      body: { // body is to the right of the anchor point
        left: `${anchorCoordinates.x + TIP_HEIGHT}px`,
        top: `${anchorCoordinates.y - TIP_OFFSET - TIP_WIDTH / 2}px`
      },
      tip: { // tip is on the left side of the body and points to the left
        left: `-${TIP_HEIGHT}px`,
        top: `${TIP_OFFSET}px`,
        width: `${TIP_HEIGHT}px`,
        height: `${TIP_WIDTH}px`
      }
    }
  }
};

const getInverseDirection = (direction: Direction) => {
  if (direction === Direction.LEFT) {
    return Direction.RIGHT;
  } else {
    return Direction.LEFT;
  }
};

const Tip = (props: TipProps) => {
  const halfBase = TIP_WIDTH / 2;
  let polygonPoints;

  if (props.direction === Direction.LEFT) {
    polygonPoints = `0,${halfBase} ${TIP_HEIGHT},0 ${TIP_HEIGHT},${TIP_WIDTH}`;
  } else {
    polygonPoints = `0,0 ${TIP_HEIGHT},${halfBase} 0,${TIP_WIDTH}`;
  }

  return (
    <svg
      className={styles.zmenuTip}
      style={props.style}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${TIP_HEIGHT} ${TIP_WIDTH}`}
    >
      <polygon points={polygonPoints} />
    </svg>
  );
};

export default Zmenu;
