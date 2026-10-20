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

import type {
  TranscriptomicSelection,
  TranscriptomicFilters,
  TranscriptomicTissueGroup
} from 'src/content/app/genome-browser/state/types/transcriptomic';
import type { GenomicTrack } from 'src/content/app/genome-browser/state/types/tracks';

export const resolveTranscriptomicTracks = (
  selections: TranscriptomicSelection[],
  selectedIds: string[]
): GenomicTrack[] => {
  const selected = new Set(selectedIds);
  const tracks = new Map<string, GenomicTrack>();
  for (const selection of selections) {
    if (!selected.has(selection.selection_id)) continue;
    for (const { track_id } of selection.track_products) {
      if (tracks.has(track_id)) continue;
      tracks.set(track_id, {
        track_id,
        label: selection.display_label,
        type: 'regular',
        additional_info: '',
        description: '',
        sources: [],
        on_by_default: true,
        display_order: tracks.size,
        has_details: false
      });
    }
  }
  return [...tracks.values()];
};

export const filterTranscriptomicSelections = (
  selections: TranscriptomicSelection[],
  filters: TranscriptomicFilters
) =>
  selections.filter(({ metadata }) =>
    Object.entries(filters).every(
      ([key, values]) =>
        !values.length ||
        values.some(
          (value) => value.toLowerCase() === metadata[key]?.toLowerCase()
        )
    )
  );

export const groupTranscriptomicSelections = (
  selections: TranscriptomicSelection[]
) => {
  const groups = new Map<
    string,
    { sampleId?: string; selections: TranscriptomicSelection[] }
  >();
  for (const selection of selections) {
    const sampleId = selection.parent_sample_id || undefined;
    const key = sampleId
      ? `sample:${sampleId}`
      : `selection:${selection.selection_id}`;
    const group = groups.get(key) ?? { sampleId, selections: [] };
    group.selections.push(selection);
    groups.set(key, group);
  }
  return [...groups.entries()];
};

export const toggleSelectionIds = (
  selectedIds: string[],
  affectedIds: string[],
  checked: boolean
) => {
  const selected = new Set(selectedIds);
  affectedIds.forEach((id) =>
    checked ? selected.add(id) : selected.delete(id)
  );
  return [...selected];
};

export const groupTranscriptomicSelectionHierarchy = (
  selections: TranscriptomicSelection[],
  hierarchy?: TranscriptomicTissueGroup[]
) => {
  if (!hierarchy) {
    return [
      {
        key: 'samples',
        label: undefined,
        samples: groupTranscriptomicSelections(selections)
      }
    ];
  }
  const byId = new Map(
    selections.map((selection) => [selection.selection_id, selection])
  );
  return hierarchy
    .map((tissue) => ({
      key: tissue.tissue,
      label: tissue.display_label,
      samples: tissue.samples
        .map(
          (
            sample
          ): ReturnType<typeof groupTranscriptomicSelections>[number] => [
            sample.sample_id,
            {
              sampleId: sample.sample_id,
              selections: sample.selection_ids.flatMap((id) => {
                const selection = byId.get(id);
                return selection ? [selection] : [];
              })
            }
          ]
        )
        .filter(([, group]) => group.selections.length)
    }))
    .filter((tissue) => tissue.samples.length);
};
