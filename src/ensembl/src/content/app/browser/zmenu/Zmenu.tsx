import React from 'react';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import useRefWithRerender from 'src/shared/hooks/useRefWithRerender';

import {
  Toolbox,
  ToolboxPosition,
  ToolboxExpandableContent
} from 'src/shared/components/toolbox';
import ZmenuContent from './ZmenuContent';
import ZmenuInstantDownload from './ZmenuInstantDownload';

import { ZmenuData, ZmenuAction } from './zmenu-types';

import styles from './Zmenu.scss';

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
  const anchorRef = useRefWithRerender<HTMLDivElement>(null);

  const onOutsideClick = () =>
    browserMessagingService.send('bpane', {
      id: props.id,
      action: ZmenuAction.ACTIVITY_OUTSIDE
    });

  const direction = chooseDirection(props);
  const toolboxPosition =
    direction === Direction.LEFT ? ToolboxPosition.LEFT : ToolboxPosition.RIGHT;

  const mainContent = <ZmenuContent content={props.content} />;
  const anchorStyles = getAnchorInlineStyles(props);

  return (
    <div ref={anchorRef} className={styles.zmenuAnchor} style={anchorStyles}>
      {anchorRef.current && (
        <Toolbox
          onOutsideClick={onOutsideClick}
          anchor={anchorRef.current}
          position={toolboxPosition}
        >
          <ToolboxExpandableContent
            mainContent={mainContent}
            footerContent={getToolboxFooterContent(props.id)}
          />
        </Toolbox>
      )}
    </div>
  );
};

const getAnchorInlineStyles = (params: ZmenuProps) => {
  const {
    anchor_coordinates: { x, y }
  } = params;
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

const getToolboxFooterContent = (id: string) => (
  <div className={styles.zmenuFooterContent}>
    <ZmenuInstantDownload id={id} />
  </div>
);

export default Zmenu;
