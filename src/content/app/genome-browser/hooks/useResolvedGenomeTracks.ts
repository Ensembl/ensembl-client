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

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store';
import {
  useGenomeTracksQuery,
  useTranscriptomicConfigurationQuery
} from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import { restoreTranscriptomicSelections } from 'src/content/app/genome-browser/state/transcriptomic/transcriptomicSlice';
import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';
import { resolveTranscriptomicTracks } from 'src/content/app/genome-browser/helpers/transcriptomic';

// All consumers share RTK Query's cached configuration and the applied membership.
export default function useResolvedGenomeTracks(genomeId: string) {
  const dispatch = useAppDispatch();
  const { currentData: categories } = useGenomeTracksQuery(genomeId, {
    skip: !genomeId
  });
  const hasTranscriptomic = !!categories?.some(
    (category) => category.track_category_id === 'transcriptomic'
  );
  const selectionIds = useAppSelector(
    (state) => state.browser.transcriptomic[genomeId]
  );
  const configurationQuery = useTranscriptomicConfigurationQuery(genomeId, {
    skip: !hasTranscriptomic
  });
  const configuration = configurationQuery.currentData;

  useEffect(() => {
    if (hasTranscriptomic && !selectionIds) {
      dispatch(
        restoreTranscriptomicSelections({
          genomeId,
          selectionIds:
            browserStorageService.getTranscriptomicSelections()[genomeId] ?? []
        })
      );
    }
  }, [dispatch, genomeId, hasTranscriptomic, selectionIds]);

  const currentData = useMemo(() => {
    if (
      !categories ||
      (hasTranscriptomic &&
        (!selectionIds || (selectionIds.length > 0 && !configuration)))
    ) {
      return undefined;
    }
    return categories.map((category) =>
      category.track_category_id === 'transcriptomic'
        ? {
            ...category,
            track_list: resolveTranscriptomicTracks(
              configuration?.selections ?? [],
              selectionIds ?? []
            )
          }
        : category
    );
  }, [categories, hasTranscriptomic, selectionIds, configuration]);

  return { currentData, categories, configurationQuery, selectionIds };
}
