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
  TranscriptomicConfiguration,
  TranscriptomicFilters,
  TranscriptomicHierarchyNode
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
    for (const product of selection.track_products) {
      const { track_id } = product;
      if (tracks.has(track_id)) continue;
      tracks.set(track_id, {
        track_id,
        label: `${selection.display_label} · ${product.display_label}`,
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

export const groupTranscriptomicTracks = (
  tracks: GenomicTrack[],
  configuration: TranscriptomicConfiguration
) => {
  const remaining = new Map(tracks.map((track) => [track.track_id, track]));
  return groupTranscriptomicSelectionHierarchy(
    configuration.selections,
    configuration.selection_hierarchy
  )
    .map((group) => ({
      key: group.key,
      label: group.label,
      tracks: group.trackIds.flatMap((id) => {
        const track = remaining.get(id);
        remaining.delete(id);
        return track ? [track] : [];
      })
    }))
    .filter((group) => group.tracks.length);
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

export const getTranscriptomicFilterOptions = (
  configuration: TranscriptomicConfiguration,
  filters: TranscriptomicFilters
) => {
  const options: TranscriptomicConfiguration['filters'] = {};
  for (const [name, values] of Object.entries(configuration.filters)) {
    // Ignore this group's choices so users can add alternatives within it.
    const matching = filterTranscriptomicSelections(configuration.selections, {
      ...filters,
      [name]: []
    });
    const counts = new Map<string, Set<string>>();
    for (const selection of matching) {
      const value = selection.metadata[name]?.toLowerCase();
      if (value === undefined) continue;
      const trackIds = counts.get(value) ?? new Set<string>();
      selection.track_products.forEach(({ track_id }) =>
        trackIds.add(track_id)
      );
      counts.set(value, trackIds);
    }
    const selected = new Set(
      filters[name]?.map((value) => value.toLowerCase())
    );
    const distinctValues = new Map<string, string>();
    values.forEach(({ value }) => {
      if (!distinctValues.has(value.toLowerCase()))
        distinctValues.set(value.toLowerCase(), value);
    });
    const available = [...distinctValues.values()]
      .map((value) => ({
        value,
        count: counts.get(value.toLowerCase())?.size ?? 0
      }))
      // Keep checked values available for removal, even if no runs match.
      .filter(
        ({ value, count }) => count > 0 || selected.has(value.toLowerCase())
      );
    if (available.length) options[name] = available;
  }
  return options;
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

export type TranscriptomicSelectionGroup = {
  key: string;
  label: string;
  selections: TranscriptomicSelection[];
  selectionIds: string[];
  trackIds: string[];
  children: TranscriptomicSelectionGroup[];
};

export const groupTranscriptomicSelectionHierarchy = (
  selections: TranscriptomicSelection[],
  hierarchy: TranscriptomicHierarchyNode[]
): TranscriptomicSelectionGroup[] => {
  const byId = new Map(
    selections.map((selection) => [selection.selection_id, selection])
  );
  const visit = (
    nodes: TranscriptomicHierarchyNode[],
    path: [string, string | null][]
  ): TranscriptomicSelectionGroup[] =>
    nodes.flatMap((node) => {
      const nodePath: typeof path = [...path, [node.level, node.value]];
      const direct = node.selection_ids.flatMap((id) => {
        const selection = byId.get(id);
        return selection ? [selection] : [];
      });
      const children = visit(node.children, nodePath);
      const selectionIds = [
        ...new Set([
          ...direct.map((selection) => selection.selection_id),
          ...children.flatMap((child) => child.selectionIds)
        ])
      ];
      if (!selectionIds.length) return [];
      return [
        {
          key: JSON.stringify(nodePath),
          label:
            node.display_label ||
            node.value ||
            `Unspecified ${node.level.replaceAll('_', ' ')}`,
          selections: direct,
          selectionIds,
          trackIds: [
            ...new Set([
              ...direct.flatMap((selection) =>
                selection.track_products.map(({ track_id }) => track_id)
              ),
              ...children.flatMap((child) => child.trackIds)
            ])
          ],
          children
        }
      ];
    });
  return visit(hierarchy, []);
};
