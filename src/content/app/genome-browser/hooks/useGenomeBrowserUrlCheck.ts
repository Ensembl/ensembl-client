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

import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';
import { useGetTrackPanelGeneQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

/**
 * A hook for validating individual parts of the url.
 * TODO: might be worth adding validation of the 'location' parameter in the future
 */

const useGenomeBrowserUrlCheck = () => {
  const {
    genomeId,
    genomeIdInUrl,
    isMissingGenomeId,
    isMalformedFocusObjectId,
    focusObjectIdInUrl,
    parsedFocusObjectId
  } = useGenomeBrowserIds();

  const isFocusGene = parsedFocusObjectId?.type === 'gene';
  let geneId;

  if (isFocusGene) {
    geneId = parsedFocusObjectId.objectId;
  }

  const { isError: isGeneQueryError, error: geneQueryError } =
    useGetTrackPanelGeneQuery(
      {
        genomeId: genomeId ?? '',
        geneId: geneId ?? ''
      },
      {
        skip: !genomeId || !geneId
      }
    );

  const isMissingGene =
    isGeneQueryError &&
    'meta' in geneQueryError &&
    geneQueryError.meta.data.gene === null;

  const isMissingFocusObject = isMissingGene; // extend this after introduction of other focus objects

  return {
    genomeIdInUrl,
    focusObjectIdInUrl,
    isMissingGenomeId,
    isMalformedFocusObjectId,
    isMissingFocusObject
  };
};

export default useGenomeBrowserUrlCheck;
