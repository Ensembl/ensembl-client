import React, { ReactNode } from 'react';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

type HoverboxProps = {
  anchor: HTMLElement;
  children: ReactNode;
};

const Hoverbox = (props: HoverboxProps) => {
  return (
    <PointerBox position={Position.RIGHT_BOTTOM} anchor={props.anchor}>
      {props.children}
    </PointerBox>
  );
};

export default Hoverbox;
