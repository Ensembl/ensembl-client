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

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store';
import useResolvedGenomeTracks from 'src/content/app/genome-browser/hooks/useResolvedGenomeTracks';
import { applyTranscriptomicSelections } from 'src/content/app/genome-browser/state/transcriptomic/transcriptomicSlice';
import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import { hasTrackSettingsForCategories } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';
import {
  filterTranscriptomicSelections,
  getTranscriptomicFilterOptions,
  getTranscriptomicProductOptions,
  groupTranscriptomicSelectionHierarchy,
  resolveTranscriptomicTracks,
  toggleSelectionIds,
  type TranscriptomicSelectionGroup
} from 'src/content/app/genome-browser/helpers/transcriptomic';
import type {
  TranscriptomicConfiguration as Configuration,
  TranscriptomicFilters
} from 'src/content/app/genome-browser/state/types/transcriptomic';
import TextButton from 'src/shared/components/text-button/TextButton';
import { PrimaryButton } from 'src/shared/components/button/Button';
import SidebarLoader from 'src/shared/components/loader/SidebarLoader';
import ConfigurationGroup from './ConfigurationGroup';
import ConfigurationOption from './ConfigurationOption';
import ConfigurationFilter from './ConfigurationFilter';
import styles from './TranscriptomicConfiguration.module.css';

export default function TranscriptomicConfiguration({
  genomeId
}: {
  genomeId: string;
}) {
  const { configurationQuery, selectionIds, currentData } =
    useResolvedGenomeTracks(genomeId);
  const settings = useAppSelector(
    (state) =>
      state.browser.trackSettings[genomeId]?.settingsForIndividualTracks
  );
  const { currentData: configuration, isError, refetch } = configurationQuery;
  const ready = hasTrackSettingsForCategories(currentData, settings);

  return (
    <div className={styles.panel}>
      {isError && (
        <div role="alert">
          Could not load transcriptomic configuration.{' '}
          <TextButton onClick={() => refetch()}>Retry</TextButton>
        </div>
      )}
      {configuration && selectionIds ? (
        <ConfigurationForm
          genomeId={genomeId}
          configuration={configuration}
          selectionIds={selectionIds}
          ready={ready && !isError}
        />
      ) : (
        <>
          <header className={styles.header}>
            <h2>Transcriptomic tracks</h2>
            <div className={styles.actions}>
              <PrimaryButton disabled>Apply</PrimaryButton>
            </div>
          </header>
          {!isError && <SidebarLoader />}
        </>
      )}
    </div>
  );
}

export function ConfigurationForm({
  genomeId,
  configuration,
  selectionIds,
  ready
}: {
  genomeId: string;
  configuration: Configuration;
  selectionIds: string[];
  ready: boolean;
}) {
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState(selectionIds);
  const [filters, setFilters] = useState<TranscriptomicFilters>({});
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const hasFilters =
    selectedProducts.length > 0 ||
    Object.values(filters).some((values) => values.length > 0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const matching = filterTranscriptomicSelections(
    configuration.selections,
    filters,
    selectedProducts
  );
  const selected = new Set(draft);
  const trackCount = resolveTranscriptomicTracks(
    configuration.selections,
    draft
  ).length;
  const selectableTrackCount = hasFilters
    ? resolveTranscriptomicTracks(
        matching,
        matching.map((selection) => selection.selection_id)
      ).length
    : configuration.track_count;
  const hiddenCount = configuration.track_count - selectableTrackCount;
  const groups = groupTranscriptomicSelectionHierarchy(
    matching,
    configuration.selection_hierarchy
  );
  const filterOptions = getTranscriptomicFilterOptions(
    configuration,
    filters,
    selectedProducts
  );
  const productOptions = getTranscriptomicProductOptions(
    configuration,
    filters
  );

  const toggle = (ids: string[], checked: boolean) =>
    setDraft((current) => toggleSelectionIds(current, ids, checked));
  const toggleExpanded = (key: string) =>
    setExpanded((current) => ({ ...current, [key]: !current[key] }));

  const changeFilters = (
    nextFilters: TranscriptomicFilters,
    nextSelectedProducts = selectedProducts
  ) => {
    const matchingIds = new Set(
      filterTranscriptomicSelections(
        configuration.selections,
        nextFilters,
        nextSelectedProducts
      ).map((selection) => selection.selection_id)
    );
    setFilters(nextFilters);
    setSelectedProducts(nextSelectedProducts);
    setDraft((current) => current.filter((id) => matchingIds.has(id)));
  };

  const apply = async () => {
    setPending(true);
    setError(false);
    try {
      const applied = await dispatch(
        applyTranscriptomicSelections({
          genomeId,
          selectionIds: draft,
          // Keep the full catalogue so the state manager can disable removed runs.
          selections: configuration.selections
        })
      ).unwrap();
      setDraft(applied.selectionIds);
      dispatch(changeDrawerViewForGenome({ genomeId, drawerView: null }));
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <h2>Transcriptomic tracks</h2>
        <div className={styles.actions}>
          <PrimaryButton disabled={!ready || pending} onClick={apply}>
            {pending ? 'Applying…' : 'Apply'}
          </PrimaryButton>
          <p role="status" className={styles.status}>
            {trackCount} of {selectableTrackCount}{' '}
            {selectableTrackCount === 1 ? 'track' : 'tracks'} selected
            {hasFilters && (
              <>
                {' '}
                · {hiddenCount} {hiddenCount === 1 ? 'track' : 'tracks'} hidden
                by filters
              </>
            )}
          </p>
        </div>
      </header>
      {error && (
        <p role="alert">Could not apply selections. Please try again.</p>
      )}
      <div
        className={styles.columns}
        role="region"
        aria-label="Tracks and filters"
      >
        <section aria-label="Track selections">
          <div className={styles.sectionHeader}>
            <h3>Tracks</h3>
            <TextButton
              disabled={pending || !draft.length}
              onClick={() => setDraft([])}
            >
              Clear selections
            </TextButton>
          </div>
          {!configuration.selections.length ? (
            <p>No transcriptomic selections are available.</p>
          ) : (
            !matching.length && <p>No selections match these filters.</p>
          )}
          <SelectionGroups
            groups={groups}
            selected={selected}
            expanded={expanded}
            pending={pending}
            onToggleExpanded={toggleExpanded}
            onChange={toggle}
          />
        </section>
        <section aria-label="Selection filters" className={styles.filtersPane}>
          <div className={styles.sectionHeader}>
            <h3>Filters</h3>
            <TextButton
              disabled={pending || !hasFilters}
              onClick={() => changeFilters({}, [])}
            >
              Clear filters
            </TextButton>
          </div>
          <div className={styles.filterGroups}>
            <ConfigurationFilter
              label="Track type"
              options={productOptions}
              selectedValues={selectedProducts}
              disabled={pending}
              onChange={(values) => changeFilters(filters, values)}
            />
            {Object.entries(filterOptions).map(([name, values]) => (
              <ConfigurationFilter
                key={name}
                label={name.replaceAll('_', ' ').toLowerCase()}
                options={values}
                selectedValues={filters[name] ?? []}
                disabled={pending}
                onChange={(values) =>
                  changeFilters({ ...filters, [name]: values })
                }
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function SelectionGroups({
  groups,
  selected,
  expanded,
  pending,
  onToggleExpanded,
  onChange
}: {
  groups: TranscriptomicSelectionGroup[];
  selected: Set<string>;
  expanded: Record<string, boolean>;
  pending: boolean;
  onToggleExpanded: (key: string) => void;
  onChange: (ids: string[], checked: boolean) => void;
}) {
  return groups.map((group) => (
    <ConfigurationGroup
      key={group.key}
      label={group.label}
      count={group.trackIds.length}
      expanded={expanded[group.key] ?? false}
      onToggle={() => onToggleExpanded(group.key)}
      selection={{
        ids: group.selectionIds,
        selected,
        disabled: pending,
        onChange
      }}
    >
      {group.selections.length > 0 && (
        <div className={styles.selections}>
          {group.selections.map((selection) => (
            <ConfigurationOption
              key={selection.selection_id}
              description={selection.track_products
                .map(({ description }) => description)
                .join('\n\n')}
              label={resolveTranscriptomicTracks(
                [selection],
                [selection.selection_id]
              )
                .map(({ label }) => label)
                .join(', ')}
              checked={selected.has(selection.selection_id)}
              disabled={pending}
              onChange={(checked) =>
                onChange([selection.selection_id], checked)
              }
            />
          ))}
        </div>
      )}
      {group.children.length > 0 && (
        <div className={styles.childGroups}>
          <SelectionGroups
            groups={group.children}
            selected={selected}
            expanded={expanded}
            pending={pending}
            onToggleExpanded={onToggleExpanded}
            onChange={onChange}
          />
        </div>
      )}
    </ConfigurationGroup>
  ));
}
