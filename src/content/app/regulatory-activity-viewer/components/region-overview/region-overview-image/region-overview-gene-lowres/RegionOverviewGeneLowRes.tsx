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

import type { ScaleLinear } from 'd3';

import { GENE_HEIGHT } from 'src/content/app/regulatory-activity-viewer/components/region-overview/region-overview-image/regionOverviewImageConstants';

import type { GeneInTrack } from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';

type Props = {
  scale: ScaleLinear<number, number>;
  gene: GeneInTrack;
  region: {
    name: string;
  };
  offsetTop: number;
  isFocused: boolean;
};

/**
 * The low-resolution version
 */

const RegionOverviewGeneLowRes = (props: Props) => {
  const { gene, scale, offsetTop } = props;

  const {
    data: { start: genomicStart, end: genomicEnd }
  } = gene;
  const start = scale(genomicStart);
  const end = scale(genomicEnd);
  const width = Math.max(end - start, 0.2);

  return <rect x={start} width={width} y={offsetTop} height={GENE_HEIGHT} />;
};

export default RegionOverviewGeneLowRes;
