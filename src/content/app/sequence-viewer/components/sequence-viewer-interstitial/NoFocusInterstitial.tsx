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

import { useEffect, useState, type SubmitEventHandler } from 'react';
import { useNavigate } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { locationRegex } from 'src/shared/helpers/genomicLocationHelpers';

import { validateGenomicLocation } from 'src/content/app/genome-browser/helpers/browserHelper';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import {
  useLazySearchGenesQuery,
  useLazySearchTranscriptsQuery
} from 'src/shared/state/api-slices/searchApiSlice';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { SecondaryButton } from 'src/shared/components/button/Button';
import { CircleLoader } from 'src/shared/components/loader';

import styles from './NoFocusInterstitial.module.css';

const NoFocusInterstitial = () => {
  const { genomeId, genomeIdForUrl } = useSequenceViewerIds();
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const { currentData: currentGeneSearchResults } = geneSearchResults;
  const [triggerTranscriptSearch, transcriptSearchResults] =
    useLazySearchTranscriptsQuery();
  const { currentData: currentTranscriptSearchResults } =
    transcriptSearchResults;
  const resetGeneSearch = geneSearchResults.reset;
  const resetTranscriptSearch = transcriptSearchResults.reset;
  const navigate = useNavigate();

  // reset search results if genome id changes
  useEffect(() => {
    resetGeneSearch();
    resetTranscriptSearch();
  }, [genomeId, resetGeneSearch, resetTranscriptSearch]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const inputValue = formData.get('search');
    const trimmedInputValue =
      typeof inputValue === 'string' ? inputValue.trim() : '';
    if (!trimmedInputValue || !genomeId) return;

    if (isLocationLike(trimmedInputValue)) {
      try {
        const validationResult = await validateGenomicLocation({
          location: trimmedInputValue,
          genomeId
        });
        if (validationResult.location) {
          navigate(
            urlFor.sequenceViewer({
              genomeId: genomeIdForUrl ?? genomeId,
              focusObject: `location:${validationResult.location}`
            })
          );
          return;
        }
      } catch {
        // Invalid locations fall through to gene and transcript search.
      }
    }
    setSearchQuery(trimmedInputValue);
    const searchRequest = {
      genome_ids: [genomeId],
      query: trimmedInputValue,
      page: 1,
      per_page: 50
    };
    triggerGeneSearch(searchRequest);
    triggerTranscriptSearch(searchRequest);
  };

  return (
    <div>
      <div className={styles.topPanel}>
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <ShadedInput
            name="search"
            autoComplete="off"
            className={styles.searchField}
            placeholder="Location, gene id or transcript id"
            autoFocus={true}
            size={'large'}
          />
          <SecondaryButton className={styles.submit}>Find</SecondaryButton>
        </form>
      </div>
      {searchQuery && (
        <div className={styles.results} aria-live="polite">
          {geneSearchResults.isFetching ||
          transcriptSearchResults.isFetching ? (
            <CircleLoader size="small" />
          ) : (
            <>
              <section>
                <h2>Gene matches</h2>
                {currentGeneSearchResults?.matches.length ? (
                  <ul>
                    {currentGeneSearchResults.matches.map((match, index) => (
                      <li key={'stable_id' in match ? match.stable_id : index}>
                        {'stable_id' in match
                          ? `${match.stable_id}${match.symbol ? ` (${match.symbol})` : ''}`
                          : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No gene matches</p>
                )}
              </section>
              <section>
                <h2>Transcript matches</h2>
                {currentTranscriptSearchResults?.matches.length ? (
                  <ul>
                    {currentTranscriptSearchResults.matches.map(
                      (match, index) => (
                        <li
                          key={'stable_id' in match ? match.stable_id : index}
                        >
                          {'stable_id' in match
                            ? `${match.stable_id}${match.symbol ? ` (${match.symbol})` : ''}`
                            : null}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>No transcript matches</p>
                )}
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const isLocationLike = (input: string) => {
  input = input.replace(/[.,]/g, '');
  return locationRegex.test(input);
};

export default NoFocusInterstitial;
