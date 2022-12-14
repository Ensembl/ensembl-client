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

import { useAppSelector } from 'src/store';

import Sidebar from 'src/shared/components/layout/sidebar/Sidebar';
import TrackPanelList from './components/track-panel-list/TrackPanelList';
import { SidebarLoader } from 'src/shared/components/loader';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveFocusObject
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

export const TrackPanel = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const activeFocusObject = useAppSelector(getBrowserActiveFocusObject);

  const { genomeBrowser } = useGenomeBrowser();

  const shouldRenderContent =
    activeGenomeId && genomeBrowser && activeFocusObject;

  return (
    <Sidebar>
      {shouldRenderContent ? <TrackPanelList /> : <SidebarLoader />}
    </Sidebar>
  );
};

export default TrackPanel;
