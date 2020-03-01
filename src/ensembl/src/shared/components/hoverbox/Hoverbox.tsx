// It is REALLY like the Tooltip, but maybe not quite, and maybe they will develop in different directions
// Is it a mistake to have is as a separate component? I don't know.

import React, { ReactNode } from 'react';

import Tooltip, { Position } from 'src/shared/components/tooltip/Tooltip';

type HoverboxProps = {
  anchor: HTMLElement;
  children: ReactNode;
};

const Hoverbox = (props: HoverboxProps) => {
  return (
    <Tooltip position={Position.RIGHT_BOTTOM} anchor={props.anchor} delay={0}>
      {props.children}
    </Tooltip>
  );
};

export default Hoverbox;
