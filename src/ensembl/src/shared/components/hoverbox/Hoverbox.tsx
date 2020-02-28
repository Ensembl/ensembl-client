// It is REALLY like the Tooltip, but maybe not quite, and maybe they will develop in different directions
// Is it a mistake to have is as a separate component? I don't know.

import React, { ReactNode } from 'react';

type HoverboxProps = {
  children: ReactNode;
};

const Hoverbox = (props: HoverboxProps) => {
  return <div>{props.children}</div>;
};

export default Hoverbox;
