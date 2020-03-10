import React, { ReactNode, useEffect, useState } from 'react';

import PointerBox from 'src/shared/components/pointer-box/PointerBox';

import { Position } from './tooltip-types';

import styles from './Tooltip.scss';

type Props = {
  position: Position;
  anchor: HTMLElement;
  container?: HTMLElement | null;
  autoAdjust: boolean; // try to adjust tooltip position so as not to extend beyond screen bounds
  delay: number;
  children: ReactNode;
  onClose: () => void;
};

type PropsWithNullableAnchor = Omit<Props, 'anchor'> & {
  anchor: HTMLElement | null;
};

const Tooltip = (props: PropsWithNullableAnchor) => {
  return props.anchor ? <TooltipWithAnchor {...(props as Props)} /> : null;
};

const TooltipWithAnchor = (props: Props) => {
  const [isWaiting, setIsWaiting] = useState(true);
  let timeoutId: NodeJS.Timeout;

  useEffect(() => {
    timeoutId = setTimeout(() => {
      setIsWaiting(false);
    }, props.delay);

    return () => clearTimeout(timeoutId);
  }, []);

  if (isWaiting) {
    return null;
  }

  return (
    <PointerBox
      position={props.position}
      anchor={props.anchor}
      container={props.container}
      autoAdjust={props.autoAdjust}
      onClose={props.onClose}
      classNames={{ body: styles.tooltip, pointer: styles.tooltipTip }}
      onOutsideClick={props.onClose}
    >
      {props.children}
    </PointerBox>
  );
};

export { Position };
export default Tooltip;
