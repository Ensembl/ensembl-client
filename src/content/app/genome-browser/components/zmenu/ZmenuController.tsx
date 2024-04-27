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

import { useEffect, memo, type RefObject } from 'react';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import Zmenu from './Zmenu';

import type { ZmenuPayload } from 'src/content/app/genome-browser/services/genome-browser-service/types/zmenu';
import type { HotspotMessage } from 'src/content/app/genome-browser/services/genome-browser-service/types/genomeBrowserMessages';

type Props = {
  containerRef: RefObject<HTMLDivElement>;
};

// when a zmenu is created, it’s assigned an id,
// and its data is saved in the state keyed by this id
// (just in case we need to show more than one zmenu at a time)
export type Zmenus = {
  [key: string]: ZmenuPayload;
};

const ZmenuController = (props: Props) => {
  const { genomeBrowserService, zmenus, setZmenus } = useGenomeBrowser();

  useEffect(() => {
    const subscription = genomeBrowserService?.subscribe(
      'hotspot',
      handleZmenuCreation
    );

    return () => subscription?.unsubscribe();
  }, [genomeBrowserService]);

  const handleZmenuCreation = (message: HotspotMessage) => {
    if (!isZmenuPayload(message.payload)) {
      return;
    }
    const payload = message.payload;
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
      containerRef={props.containerRef}
      payload={zmenus[id]}
    />
  ));

  return <>{zmenuElements}</>;
};

const isZmenuPayload = (
  payload: HotspotMessage['payload']
): payload is ZmenuPayload => {
  return payload.variety[0].type === 'zmenu';
};

export default memo(ZmenuController);
