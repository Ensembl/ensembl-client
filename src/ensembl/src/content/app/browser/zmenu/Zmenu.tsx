import React, { useState, useRef, useEffect } from 'react';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';

import {
  Toolbox,
  ToolboxPosition,
  ToolboxExpandableContent,
  ToggleButton as ToolboxToggleButton
} from 'src/shared/components/toolbox';
import ZmenuContent from './ZmenuContent';

import { ZmenuData, ZmenuAction } from './zmenu-types';

import styles from './Zmenu.scss';

// const TIP_WIDTH = 18;
// const TIP_HEIGHT = 13;
// // extra height makes the tip a bit higher and is used to anchor the tip in zmenu body (goes inside the body)
// const TIP_EXTRA_HEIGHT = 2;
// const TIP_OFFSET = 10;

enum Direction {
  LEFT = 'left',
  RIGHT = 'right'
}

export type ZmenuProps = ZmenuData & {
  browserRef: React.RefObject<HTMLDivElement>;
  onEnter: (id: string) => void;
  onLeave: (id: string) => void;
};

const Zmenu = (props: ZmenuProps) => {
  const [isRendered, setIsRendered] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  const onOutsideClick = () =>
    browserMessagingService.send('bpane', {
      id: props.id,
      action: ZmenuAction.ACTIVITY_OUTSIDE
    });

  const direction = chooseDirection(props);
  const toolboxPosition = direction === Direction.LEFT
    ? ToolboxPosition.LEFT
    : ToolboxPosition.RIGHT;

  const mainContent = <ZmenuContent content={props.content} />;
  const anchorStyles = getAnchorInlineStyles(props);

  return (
    <div
      ref={anchorRef}
      className={styles.zmenuAnchor} style={anchorStyles}
    >
      { isRendered && anchorRef.current &&
        <Toolbox
          onOutsideClick={onOutsideClick}
          anchor={anchorRef.current}
          position={toolboxPosition}
        >
          { mainContent }
        </Toolbox>
      }
    </div>
  );
};

const getAnchorInlineStyles = (params: ZmenuProps) => {
  const { anchor_coordinates: { x, y } } = params;
  return {
    left: `${x}px`,
    top: `${y}px`
  };
};

// choose how to position zmenu relative to its anchor point
const chooseDirection = (params: ZmenuProps) => {
  const browserElement = params.browserRef.current as HTMLDivElement;
  const { width } = browserElement.getBoundingClientRect();
  const { x } = params.anchor_coordinates;
  return x > width / 2 ? Direction.LEFT : Direction.RIGHT;
};

export default Zmenu;
