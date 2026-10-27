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
import { Link, useNavigate } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { locationRegex } from 'src/shared/helpers/genomicLocationHelpers';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import { validateGenomicLocation } from 'src/content/app/genome-browser/helpers/browserHelper';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { useExampleObjectsForGenomeQuery } from 'src/shared/state/genome/genomeApiSlice';
import {
  useLazySearchGenesQuery,
  useLazySearchTranscriptsQuery
} from 'src/shared/state/api-slices/searchApiSlice';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { SecondaryButton } from 'src/shared/components/button/Button';
import { CircleLoader } from 'src/shared/components/loader';
import GeneName from 'src/shared/components/gene-name/GeneName';

import type {
  GeneSearchMatch,
  TranscriptSearchMatch
} from 'src/shared/types/search-api/search-match';

import styles from './NoFocusInterstitial.module.css';

const NoFocusInterstitial = () => {
  const { genomeIdInUrl, genomeId, genomeIdForUrl } = useSequenceViewerIds();
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
    <div className={styles.container}>
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
      {!searchQuery && (
        <ExampleLinks
          genomeIdForUrl={genomeIdInUrl as string}
          genomeId={genomeId}
        />
      )}
      {searchQuery && (
        <div className={styles.results} aria-live="polite">
          {geneSearchResults.isFetching ||
          transcriptSearchResults.isFetching ? (
            <CircleLoader size="small" />
          ) : (
            <>
              <section className={styles.searchResultsSection}>
                <div className={styles.searchResultsSectionHeading}>
                  Gene search results
                </div>
                {currentGeneSearchResults?.matches.length ? (
                  <>
                    {currentGeneSearchResults.matches.map((match) => (
                      <GeneLink key={match.stable_id} searchMatch={match} />
                    ))}
                  </>
                ) : (
                  <div className={styles.noSearchResults}>No gene matches</div>
                )}
              </section>
              <section className={styles.searchResultsSection}>
                <div className={styles.searchResultsSectionHeading}>
                  Transcript search results
                </div>
                {currentTranscriptSearchResults?.matches.length ? (
                  <>
                    {currentTranscriptSearchResults.matches.map((match) => (
                      <TranscriptLink
                        key={match.stable_id}
                        searchMatch={match}
                      />
                    ))}
                  </>
                ) : (
                  <div className={styles.noSearchResults}>
                    No transcript matches
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const allowedExampleObjectTypes = ['gene', 'location'];

const ExampleLinks = ({
  genomeId,
  genomeIdForUrl
}: {
  genomeId?: string;
  genomeIdForUrl: string;
}) => {
  const { currentData, isLoading } = useExampleObjectsForGenomeQuery(
    genomeId ?? '',
    {
      skip: !genomeId
    }
  );

  if (isLoading) {
    return (
      <div className={styles.exampleLinks}>
        <CircleLoader />
      </div>
    );
  }

  const exampleFocusObjects = (currentData || []).filter((obj) =>
    allowedExampleObjectTypes.includes(obj.type)
  );

  const exampleLinks = exampleFocusObjects.map((exampleObject) => {
    const focusId = buildFocusIdForUrl({
      type: exampleObject.type,
      objectId: exampleObject.id
    });
    const path = urlFor.sequenceViewer({
      genomeId: genomeIdForUrl,
      focusObject: focusId
    });

    return (
      <div key={exampleObject.id}>
        <Link to={path} replace>
          Example {exampleObject.type}
        </Link>
      </div>
    );
  });

  return <div className={styles.exampleLinks}>{exampleLinks}</div>;
};

const GeneLink = ({ searchMatch }: { searchMatch: GeneSearchMatch }) => {
  const focusIdForUrl = buildFocusIdForUrl({
    type: 'gene',
    objectId: searchMatch.unversioned_stable_id
  });
  const url = urlFor.sequenceViewer({
    genomeId: searchMatch.genome_id,
    focusObject: focusIdForUrl
  });

  return (
    <Link to={url}>
      <GeneName stable_id={searchMatch.stable_id} symbol={searchMatch.symbol} />
    </Link>
  );
};

const TranscriptLink = ({
  searchMatch
}: {
  searchMatch: TranscriptSearchMatch;
}) => {
  const focusIdForUrl = buildFocusIdForUrl({
    type: 'transcript',
    objectId: searchMatch.unversioned_stable_id
  });
  const url = urlFor.sequenceViewer({
    genomeId: searchMatch.genome_id,
    focusObject: focusIdForUrl
  });

  return <Link to={url}>{searchMatch.stable_id}</Link>;
};

const isLocationLike = (input: string) => {
  input = input.replace(/[.,]/g, '');
  return locationRegex.test(input);
};

export default NoFocusInterstitial;
