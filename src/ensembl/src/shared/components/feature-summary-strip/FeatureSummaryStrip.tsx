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

import { GeneSummaryStrip, RegionSummaryStrip } from '../feature-summary-strip';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

export type FeatureSummaryStripProps = {
  ensObject: EnsObject;
  isGhosted?: boolean;
};

export const FeatureSummaryStrip = (props: FeatureSummaryStripProps) => {
  const { ensObject, isGhosted } = props;

  switch (ensObject.object_type) {
    case 'gene':
      return <GeneSummaryStrip gene={ensObject} isGhosted={isGhosted} />;
    case 'region':
      return <RegionSummaryStrip region={ensObject} isGhosted={isGhosted} />;
    default:
      return null;
  }
};

export default FeatureSummaryStrip;
