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

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from 'src/store';

import { getExpandedTranscriptConseqeuenceIds } from '../../state/variant-view/transcriptConsequenceSelectors';
import { toggleTranscriptIds } from '../../state/variant-view/transcriptConsequenceSlice';

type Params = {
  genomeId: string;
  variantId: string;
  alleleId: string;
  expandTranscriptIds: string[];
};

const useExpandedTranscripts = (params: Params) => {
  const { genomeId, variantId, alleleId, expandTranscriptIds } = params;
  const dispatch = useAppDispatch();
  const expandedIds = useAppSelector((state) =>
    getExpandedTranscriptConseqeuenceIds(state, genomeId, variantId, alleleId)
  );

  useEffect(() => {
    if (expandedIds === null) {
      dispatch(
        toggleTranscriptIds(genomeId, variantId, alleleId, expandTranscriptIds)
      );
    }
  }, [genomeId, variantId, alleleId]);
};

export default useExpandedTranscripts;
