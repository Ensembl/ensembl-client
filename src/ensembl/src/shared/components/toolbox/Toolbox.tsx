import React, { ReactNode } from 'react';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

import styles from './Toolbox.scss';

export type ToolboxPosition =
  | Position.LEFT_TOP
  | Position.RIGHT_TOP;

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
  position: Position.RIGHT_TOP
} as Partial<ToolboxProps>;;

export default Toolbox;
