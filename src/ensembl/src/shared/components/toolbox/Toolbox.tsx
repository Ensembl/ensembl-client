import React, { ReactNode } from 'react';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

import styles from './Toolbox.scss';

export enum ToolboxPosition {
  LEFT = 'left',
  RIGHT = 'right'
};

type ToolboxProps = {
  position: ToolboxPosition;
  anchor: HTMLElement;
  children: ReactNode;
};

const Toolbox = (props: ToolboxProps) => {
  const pointerBoxPosition = props.position === ToolboxPosition.LEFT
    ? Position.LEFT_BOTTOM
    : Position.RIGHT_BOTTOM;

  return (
    <PointerBox
      position={pointerBoxPosition}
      anchor={props.anchor}
      renderInsideAnchor={true}
      classNames={{ body: styles.toolbox, pointer: styles.tooltipTip }}
    >
      {props.children}
    </PointerBox>
  );
};

Toolbox.defaultProps = {
  position: ToolboxPosition.RIGHT
} as Partial<ToolboxProps>;

export default Toolbox;
