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

import RadioGroup, {
  type RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';
import GeneTrackConfig from './track-config-views/GeneTrackConfig';
import RegularTrackConfig from './track-config-views/RegularTrackConfig';

import { useAppSelector } from 'src/store';
import {
  getTrackType,
  TrackType
} from 'src/content/app/genome-browser/state/track-config/trackConfigSlice';

import {
  getApplyToAllConfig,
  getBrowserSelectedCog
} from 'src/content/app/genome-browser/state/track-config/trackConfigSelectors';

import useBrowserTrackConfig from './useBrowserTrackConfig';

import styles from './BrowserTrackConfig.scss';

const getTrackConfigComponent = (trackType: TrackType) => {
  switch (trackType) {
    case TrackType.GENE:
      return <GeneTrackConfig />;
    case TrackType.REGULAR:
      return <RegularTrackConfig />;
  }
};

export const BrowserTrackConfig = () => {
  const shouldApplyToAll = useAppSelector(getApplyToAllConfig);
  const selectedCog = useAppSelector(getBrowserSelectedCog) || '';
  const trackType = getTrackType(selectedCog);
  const { toggleApplyToAll } = useBrowserTrackConfig();

  if (!trackType) {
    return null;
  }

  const radioOptions: RadioOptions = [
    {
      value: 'this_track',
      label: 'This track'
    },
    {
      value: 'all_tracks',
      label: 'All tracks'
    }
  ];

  return (
    <div className={styles.trackConfig}>
      <div className={styles.section}>
        <RadioGroup
          options={radioOptions}
          onChange={toggleApplyToAll}
          selectedOption={shouldApplyToAll ? 'all_tracks' : 'this_track'}
        />
      </div>
      {getTrackConfigComponent(trackType)}
    </div>
  );
};

export default BrowserTrackConfig;
