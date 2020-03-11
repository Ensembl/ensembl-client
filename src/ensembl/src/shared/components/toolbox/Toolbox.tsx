import React, { ReactNode } from 'react';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

import styles from './Toolbox.scss';

type HoverboxProps = {
  anchor: HTMLElement;
  children: ReactNode;
};

const Toolbox = (props: HoverboxProps) => {
  return (
    <PointerBox
      position={Position.RIGHT_BOTTOM}
      anchor={props.anchor}
      renderInsideAnchor={true}
      classNames={{ body: styles.toolbox, pointer: styles.tooltipTip }}
    >
      {props.children}
    </PointerBox>
  );
};

export default Toolbox;
