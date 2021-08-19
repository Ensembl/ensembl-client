/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

import { ZmenuData, ZmenuAction, ZmenuContentFeature } from './zmenu-types';

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
            footerContent={getToolboxFooterContent(props.content)}
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

const getToolboxFooterContent = (content: ZmenuContentFeature[]) => (
  <div className={styles.zmenuFooterContent}>
    <ZmenuInstantDownload features={content} />
  </div>
);

export default Zmenu;
