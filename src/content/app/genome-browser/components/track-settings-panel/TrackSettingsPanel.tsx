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

import React, { useRef } from 'react';

import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import GeneTrackSettings from './track-settings-views/GeneTrackSettings';
import VariantTrackSettings from './track-settings-views/VariantTrackSettings';
import RegularTrackSettings from './track-settings-views/RegularTrackSettings';

import { TrackType } from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';

type Props = {
  trackId: string;
  trackType: TrackType;
  onOutsideClick: () => void;
};

const getTrackSettingsPanelComponent = (trackType: TrackType) => {
  switch (trackType) {
    case TrackType.GENE:
    case TrackType.FOCUS_GENE:
      return GeneTrackSettings;
    case TrackType.VARIANT:
    case TrackType.FOCUS_VARIANT:
      return VariantTrackSettings;
    case TrackType.REGULAR:
      return RegularTrackSettings;
  }
};

export const TrackSettingsPanel = (props: Props) => {
  const { trackId, trackType } = props;

  const trackSettingsRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(trackSettingsRef, props.onOutsideClick);

  if (!trackType) {
    return null;
  }

  const Track = getTrackSettingsPanelComponent(trackType);

  return <Track trackId={trackId} ref={trackSettingsRef} />;
};

export default TrackSettingsPanel;
