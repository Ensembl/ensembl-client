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

import { memo } from 'react';

import type { PredictedRegulatoryConsequence } from 'src/content/app/tools/vep/types/vepResultsResponse';

import commonStyles from '../../VepSubmissionResults.module.css';

type Props = {
  feature: PredictedRegulatoryConsequence;
};

// The feature's id, with its biotype beneath. A motif has no biotype.
const VepResultsRegulatoryFeature = (props: Props) => {
  const { stable_id, biotype } = props.feature;

  return (
    <>
      <div>{stable_id}</div>
      {biotype && <div className={commonStyles.smallLight}>{biotype}</div>}
    </>
  );
};

export default memo(VepResultsRegulatoryFeature);
