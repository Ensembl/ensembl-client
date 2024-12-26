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

import { scaleLinear } from 'd3';

import { prepareActivityDataForDisplay } from './prepareActivityDataForDisplay';

import { useEpigenomesActivityQuery } from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

import EpigenomeActivityImage from './EpigenomesActivityImage';

import regionOverviewStyles from '../region-overview/RegionOverview.module.css';

type Props = {
  genomeId: string;
};

/**
 * TODO: delete this comment when this is no longer a test file
 * Test location
 *  - region name: 17 (human chromosome 17)
 *  - start: 58490566
 *  - end: 58699001
 *  - length: 208435
 */

const testGenomicLocation = {
  start: 58490566,
  end: 58699001
};

// eslint-disable-next-line   -- FIXME: remove this comment when props start being used
const EpigenomesActivity = (props: Props) => {
  const { currentData } = useEpigenomesActivityQuery();
  const location = testGenomicLocation;
  const width = 800;

  const scale = scaleLinear()
    .domain([location.start, location.end])
    .rangeRound([0, Math.floor(width)]);

  if (!currentData) {
    return null;
  }

  const preparedData = prepareActivityDataForDisplay({
    data: currentData,
    location,
    scale
  });

  return (
    <div className={regionOverviewStyles.grid}>
      <div className={regionOverviewStyles.middleColumn}>
        <EpigenomeActivityImage
          data={preparedData}
          scale={scale}
          width={width}
        />
      </div>
    </div>
  );
};

export default EpigenomesActivity;
