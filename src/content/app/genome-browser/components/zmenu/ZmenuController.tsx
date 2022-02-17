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

import React, { useEffect, memo } from 'react';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import {
  ZmenuCreateAction,
  IncomingActionType,
  ZmenuCreatePayload
} from '@ensembl/ensembl-genome-browser';

import Zmenu from './Zmenu';

type Props = {
  browserRef: React.RefObject<HTMLDivElement>;
};

// when a zmenu is created, it’s assigned an id,
// and its data is saved in the state keyed by this id
// (just in case we need to show more than one zmenu at a time)
export type StateZmenu = {
  [key: string]: ZmenuCreatePayload;
};

const ZmenuController = (props: Props) => {
  const { genomeBrowser, zmenus, setZmenus } = useGenomeBrowser();

  useEffect(() => {
    const subscription = genomeBrowser?.subscribe(
      IncomingActionType.ZMENU_CREATE,
      handleZmenuCreate
    );

    return () => subscription?.unsubscribe();
  }, [genomeBrowser]);

  const handleZmenuCreate = (action: ZmenuCreateAction) => {
    const payload = action.payload;

    if (!payload.variety.length) {
      return;
    }
    const zmenuId = Object.keys(zmenus).length + 1;

    setZmenus &&
      setZmenus({
        ...zmenus,
        [zmenuId]: payload
      });
  };

  if (!zmenus) {
    return null;
  }
  const zmenuElements = Object.keys(zmenus).map((id) => (
    <Zmenu
      key={id}
      zmenuId={id}
      browserRef={props.browserRef}
      payload={zmenus[id]}
    />
  ));

  return <>{zmenuElements}</>;
};

export default memo(ZmenuController);
