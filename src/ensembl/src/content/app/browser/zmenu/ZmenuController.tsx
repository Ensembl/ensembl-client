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

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import pickBy from 'lodash/pickBy';
import Zmenu from './Zmenu';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import { changeHighlightedTrackId } from 'src/content/app/browser/track-panel/trackPanelActions';

import {
  ZmenuData,
  ZmenuAction,
  ZmenuIncomingPayload,
  ZmenuCreatePayload,
  ZmenuDestroyPayload,
  ZmenuRepositionPayload
} from './zmenu-types';

type Props = {
  browserRef: React.RefObject<HTMLDivElement>;
};

// when a zmenu is created, it’s assigned an id,
// and its data is saved in the state keyed by this id
// (just in case we need to show more than one zmenu at a time)
type StateZmenu = {
  [key: string]: ZmenuData;
};

const ZmenuController = (props: Props) => {
  const dispatch = useDispatch();

  const [zmenus, setZmenus] = useState<StateZmenu>({});

  useEffect(() => {
    const subscription = browserMessagingService.subscribe(
      'bpane-zmenu',
      handleBpaneEvent
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleBpaneEvent = (payload: ZmenuIncomingPayload) => {
    if (payload.action === ZmenuAction.CREATE) {
      handleZmenuCreate(payload);
    } else if (payload.action === ZmenuAction.DESTROY) {
      handleZmenuDestroy(payload);
    } else if (payload.action === ZmenuAction.REPOSITION) {
      handleZmenuReposition(payload);
    }
  };

  const handleZmenuCreate = (payload: ZmenuCreatePayload) => {
    const newZmenu = {
      id: payload.id,
      anchor_coordinates: payload.anchor_coordinates,
      content: payload.content
    };

    dispatch(changeHighlightedTrackId(payload.content[0].track_id));

    setZmenus({
      ...zmenus,
      [payload.id]: newZmenu
    });
  };

  const handleZmenuDestroy = (payload: ZmenuDestroyPayload) => {
    dispatch(changeHighlightedTrackId(''));
    setZmenus(pickBy(zmenus, (value, key) => key !== payload.id));
  };

  const handleZmenuReposition = (payload: ZmenuRepositionPayload) => {
    setZmenus({
      ...zmenus,
      [payload.id]: {
        ...zmenus[payload.id],
        anchor_coordinates: payload.anchor_coordinates
      }
    });
  };

  const handleZmenuEnter = (id: string) => {
    const payload = {
      id,
      action: ZmenuAction.ENTER
    };
    browserMessagingService.send('bpane', payload);
  };

  const handleZmenuLeave = (id: string) => {
    const payload = {
      id,
      action: ZmenuAction.LEAVE
    };
    browserMessagingService.send('bpane', payload);
  };

  const zmenuElements = Object.keys(zmenus).map((id) => (
    <Zmenu
      key={id}
      browserRef={props.browserRef}
      onEnter={handleZmenuEnter}
      onLeave={handleZmenuLeave}
      {...zmenus[id]}
    />
  ));

  return <>{zmenuElements}</>;
};

export default ZmenuController;
