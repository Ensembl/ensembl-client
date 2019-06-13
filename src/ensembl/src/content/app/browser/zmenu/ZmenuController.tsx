import React, { useState } from 'react';

import Zmenu from './Zmenu';

import {
  ZmenuData,
  ZmenuAction,
  ZmenuIncomingEvent,
  ZmenuCreateEvent,
  ZmenuDestroyEvent
} from './zmenu-types';

type Props = {
  browserRef: React.RefObject<HTMLDivElement>;
};

// when a zmenu is created, it’s assigned an id,
// and its data is saved in the state keyed by this id
type StateZmenu = {
  [key: string]: ZmenuData;
};

const ZmenuController = (props: Props) => {
  const handleBpaneEvent = (event: ZmenuIncomingEvent) => {
    if (event.action === ZmenuAction.CREATE) {
      handleZmenuCreate(event as ZmenuCreateEvent);
    } else if (event.action === ZmenuAction.DESTROY) {
      handleZmenuDestroy(event as ZmenuDestroyEvent);
    }
  };

  const handleZmenuCreate = (event: ZmenuCreateEvent) => {};

  const handleZmenuDestroy = (event: ZmenuDestroyEvent) => {};

  const handleZmenuEnter = () => {};

  const handleZmenuLeave = () => {};

  const handleZmenuReposition = () => {};

  return (
    <Zmenu
      browserRef={props.browserRef}
      onEnter={handleZmenuEnter}
      onLeave={handleZmenuLeave}
    />
  );
};

export default ZmenuController;
