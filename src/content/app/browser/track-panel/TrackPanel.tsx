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

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import TrackPanelList from './track-panel-list/TrackPanelList';
import TrackPanelModal from './track-panel-modal/TrackPanelModal';
import { SidebarLoader } from 'src/shared/components/loader';

import { getIsTrackPanelModalOpened } from './trackPanelSelectors';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject
} from '../browserSelectors';

import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

export const TrackPanel = () => {
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const activeEnsObject = useSelector(getBrowserActiveEnsObject);
  const isTrackPanelModalOpened = useSelector(getIsTrackPanelModalOpened);

  const { genomeBrowser, restoreBrowserTrackStates } = useGenomeBrowser();

  const shouldRenderContent =
    activeGenomeId && genomeBrowser && activeEnsObject;

  useEffect(() => {
    if (genomeBrowser) {
      restoreBrowserTrackStates();
    }
  }, [activeEnsObject]);

  return shouldRenderContent ? (
    isTrackPanelModalOpened ? (
      <TrackPanelModal />
    ) : (
      <TrackPanelList />
    )
  ) : (
    <SidebarLoader />
  );
};

export default TrackPanel;
