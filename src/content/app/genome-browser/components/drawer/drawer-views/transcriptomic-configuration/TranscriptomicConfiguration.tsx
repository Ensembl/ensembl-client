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
import {
  filterTranscriptomicSelections,
  groupTranscriptomicSelections,
  resolveTranscriptomicTracks,
  toggleSelectionIds
} from 'src/content/app/genome-browser/helpers/transcriptomic';
import type {
  TranscriptomicConfiguration as Configuration,
  TranscriptomicFilters
} from 'src/content/app/genome-browser/state/types/transcriptomic';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';
import FlatInput from 'src/shared/components/input/FlatInput';
import TextButton from 'src/shared/components/text-button/TextButton';
import { PrimaryButton } from 'src/shared/components/button/Button';
import SidebarLoader from 'src/shared/components/loader/SidebarLoader';
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
  const ready =
    !!settings &&
    !!currentData &&
    currentData.every((category) =>
      category.track_list.every((track) => !!settings[track.track_id])
    );

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
            <PrimaryButton disabled>Apply</PrimaryButton>
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
  const [searches, setSearches] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const matching = filterTranscriptomicSelections(
    configuration.selections,
    filters
  );
  const selected = new Set(draft);
  const selectedSelections = configuration.selections.filter((s) =>
    selected.has(s.selection_id)
  );
  const hiddenCount =
    selectedSelections.length -
    matching.filter((s) => selected.has(s.selection_id)).length;
  const trackCount = resolveTranscriptomicTracks(
    configuration.selections,
    draft
  ).length;

  const apply = async () => {
    setPending(true);
    setError(false);
    try {
      await dispatch(
        applyTranscriptomicSelections({
          genomeId,
          selectionIds: draft,
          selections: configuration.selections
        })
      ).unwrap();
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
        <PrimaryButton disabled={!ready || pending} onClick={apply}>
          {pending ? 'Applying…' : 'Apply'}
        </PrimaryButton>
      </header>
      {error && (
        <p role="alert">Could not apply selections. Please try again.</p>
      )}
      <p role="status">
        {selectedSelections.length} selections · {trackCount} tracks selected ·{' '}
        {hiddenCount} selections hidden by filters
      </p>
      <div className={styles.columns}>
        <section aria-label="Track selections">
          <h3>Selections</h3>
          {!configuration.selections.length ? (
            <p>No transcriptomic selections are available.</p>
          ) : (
            !matching.length && <p>No selections match these filters.</p>
          )}
          {groupTranscriptomicSelections(matching).map(([key, group]) => {
            const ids = group.selections.map((s) => s.selection_id);
            const checkedCount = ids.filter((id) => selected.has(id)).length;
            return (
              <div key={key} className={styles.sample}>
                {group.sampleId && (
                  <label className={styles.sampleLabel}>
                    <Checkbox
                      checked={checkedCount === ids.length}
                      disabled={pending}
                      ref={(element) => {
                        if (element)
                          element.indeterminate =
                            checkedCount > 0 && checkedCount < ids.length;
                      }}
                      onChange={(event) =>
                        setDraft((current) =>
                          toggleSelectionIds(current, ids, event.target.checked)
                        )
                      }
                    />
                    <span>{group.sampleId}</span>
                  </label>
                )}
                <div className={group.sampleId ? styles.runs : undefined}>
                  {group.selections.map((selection) => (
                    <CheckboxWithLabel
                      key={selection.selection_id}
                      label={selection.display_label}
                      checked={selected.has(selection.selection_id)}
                      disabled={pending}
                      onChange={(checked) =>
                        setDraft((current) =>
                          toggleSelectionIds(
                            current,
                            [selection.selection_id],
                            checked
                          )
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
        <section aria-label="Selection filters">
          <div className={styles.filterHeader}>
            <h3>Filters</h3>
            <TextButton
              onClick={() => {
                setFilters({});
                setSearches({});
              }}
            >
              Clear filters
            </TextButton>
          </div>
          {Object.entries(configuration.filters).map(([name, values]) => (
            <fieldset key={name} className={styles.filter}>
              <legend>{name.replaceAll('_', ' ')}</legend>
              <FlatInput
                type="search"
                aria-label={`Search ${name.replaceAll('_', ' ')} values`}
                placeholder="Search values"
                value={searches[name] ?? ''}
                onChange={(event) =>
                  setSearches((current) => ({
                    ...current,
                    [name]: event.target.value
                  }))
                }
              />
              <div className={styles.filterValues}>
                {values
                  .filter(({ value }) =>
                    value
                      .toLowerCase()
                      .includes((searches[name] ?? '').toLowerCase())
                  )
                  .map(({ value, count }) => (
                    <CheckboxWithLabel
                      key={value}
                      label={`${value} (${count})`}
                      checked={filters[name]?.includes(value) ?? false}
                      onChange={(checked) =>
                        setFilters((current) => ({
                          ...current,
                          [name]: toggleSelectionIds(
                            current[name] ?? [],
                            [value],
                            checked
                          )
                        }))
                      }
                    />
                  ))}
              </div>
            </fieldset>
          ))}
        </section>
      </div>
    </>
  );
}
