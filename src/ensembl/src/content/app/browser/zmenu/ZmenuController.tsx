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

import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import pickBy from 'lodash/pickBy';
import Zmenu from './Zmenu';

import {
  OutgoingActionType,
  OutgoingAction,
  IncomingActionType,
  IncomingAction
} from 'src/content/app/browser/browser-messaging-service';

import { changeHighlightedTrackId } from 'src/content/app/browser/track-panel/trackPanelActions';

import {
  ZmenuData,
  ZmenuCreatePayload,
  ZmenuDestroyPayload,
  ZmenuRepositionPayload
} from './zmenu-types';
import { GenomeBrowserContext } from 'src/content/app/browser/Browser';

type Props = {
  browserRef: React.RefObject<HTMLDivElement>;
  changeHighlightedTrackId: (trackId: string) => void;
};

// when a zmenu is created, it’s assigned an id,
// and its data is saved in the state keyed by this id
// (just in case we need to show more than one zmenu at a time)
type StateZmenu = {
  [key: string]: ZmenuData;
};

const ZmenuController = (props: Props) => {
  const [zmenus, setZmenus] = useState<StateZmenu>({});

  const { genomeBrowser } = useContext(GenomeBrowserContext);

  useEffect(() => {
    const subscription = genomeBrowser?.subscribe(
      [
        IncomingActionType.ZMENU_CREATE,
        IncomingActionType.ZMENU_DESTROY,
        IncomingActionType.ZMENU_REPOSITION
      ],
      handleBpaneEvent
    );

    return () => subscription?.unsubscribe();
  }, []);

  const handleBpaneEvent = (action: IncomingAction) => {
    const { type, payload } = action;
    if (type === IncomingActionType.ZMENU_CREATE) {
      handleZmenuCreate(payload as ZmenuCreatePayload);
    } else if (type === IncomingActionType.ZMENU_DESTROY) {
      handleZmenuDestroy(payload as ZmenuDestroyPayload);
    } else if (type === IncomingActionType.ZMENU_REPOSITION) {
      handleZmenuReposition(payload as ZmenuRepositionPayload);
    }
  };

  const handleZmenuCreate = (payload: ZmenuCreatePayload) => {
    const newZmenu = {
      id: payload.id,
      anchor_coordinates: payload.anchor_coordinates,
      content: payload.content
    };

    props.changeHighlightedTrackId(payload.content[0].track_id);

    setZmenus({
      ...zmenus,
      [payload.id]: newZmenu
    });
  };

  const handleZmenuDestroy = (payload: ZmenuDestroyPayload) => {
    props.changeHighlightedTrackId('');
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
    const action: OutgoingAction = {
      payload: {
        id
      },
      type: OutgoingActionType.ZMENU_ENTER
    };
    genomeBrowser?.send(action);
  };

  const handleZmenuLeave = (id: string) => {
    const action: OutgoingAction = {
      payload: { id },
      type: OutgoingActionType.ZMENU_LEAVE
    };
    genomeBrowser?.send(action);
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
const mapDispatchToProps = {
  changeHighlightedTrackId
};

export default connect(undefined, mapDispatchToProps)(ZmenuController);
