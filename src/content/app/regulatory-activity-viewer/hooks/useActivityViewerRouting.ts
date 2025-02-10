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
import { useNavigate } from 'react-router';

import { useAppDispatch } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  setActiveGenomeId,
  setDefaultActiveGenomeId
} from 'src/content/app/regulatory-activity-viewer/state/general/generalSlice';

import useActivityViewerIds from './useActivityViewerIds';

/**
 * 1. Genome id
 *
 * - If there is no genome id suggested by the url
 *  - If active genome id exists
 *    - Update url to reflect active genome id
 *  - If active genome id does not exist
 *    - If there are some selected species
 *      - Make the first selected species' genome id into an active one
 *      - Update url to reflect new active genome id
 * - If genome id suggested by url exists and is different from active genome id
 *  - Update active genome id
 */

const useActivityViewerRouting = () => {
  const {
    activeGenomeId,
    genomeId,
    genomeIdInUrl,
    genomeIdForUrl,
    locationForUrl
  } = useActivityViewerIds();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (genomeIdForUrl && genomeIdForUrl !== genomeIdInUrl) {
      const newUrl = urlFor.regulatoryActivityViewer({
        genomeId: genomeIdForUrl,
        location: locationForUrl ?? undefined
      });
      navigate(newUrl, { replace: true });
    }
    if (genomeId && genomeId !== activeGenomeId) {
      dispatch(setActiveGenomeId(genomeId));
    } else if (!activeGenomeId) {
      dispatch(setDefaultActiveGenomeId());
    }
  }, [activeGenomeId, genomeId, genomeIdInUrl, genomeIdForUrl, locationForUrl]);
};

export default useActivityViewerRouting;
