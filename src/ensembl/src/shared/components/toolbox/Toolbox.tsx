import React, { ReactNode } from 'react';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

import styles from './Toolbox.scss';

export type ToolboxPosition = Position.LEFT_BOTTOM | Position.RIGHT_BOTTOM;

type ToolboxProps = {
  position: ToolboxPosition;
  anchor: HTMLElement;
  children: ReactNode;
};

const Toolbox = (props: ToolboxProps) => {
  return (
    <PointerBox
      position={props.position}
      anchor={props.anchor}
      renderInsideAnchor={true}
      classNames={{ body: styles.toolbox, pointer: styles.tooltipTip }}
    >
      {props.children}
    </PointerBox>
  );
};

Toolbox.defaultProps = {
  position: Position.RIGHT_BOTTOM
} as Partial<ToolboxProps>;

export default Toolbox;
