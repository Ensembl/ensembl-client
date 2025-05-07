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

import type { GeneInRegionOverview } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

type CommonMessageFields = {
  coordinates: {
    x: number;
    y: number;
  };
};

export type GenePopupMessage = CommonMessageFields & {
  type: 'gene';
  content: Pick<
    GeneInRegionOverview,
    | 'symbol'
    | 'stable_id'
    | 'unversioned_stable_id'
    | 'biotype'
    | 'strand'
    | 'start'
    | 'end'
  > & {
    region_name: string;
  };
};

export type RegulatoryFeatureMessage = CommonMessageFields & {
  type: 'regulatory-feature';
  content: {
    id: string;
    feature_type: string;
    region_name: string;
    start: number;
    end: number;
    extended_start?: number;
    extended_end?: number;
  };
};

export type PopupMessage = GenePopupMessage | RegulatoryFeatureMessage;
