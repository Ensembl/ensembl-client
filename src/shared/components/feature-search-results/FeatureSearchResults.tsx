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

import classNames from 'classnames';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import { Table } from 'src/shared/components/table';
import SpeciesName from '../species-name/SpeciesName';

import type {
  GeneSearchMatch,
  SearchMatch,
  TranscriptSearchMatch,
  VariantSearchMatch
} from 'src/shared/types/search-api/search-match';
import type { SearchResults } from 'src/shared/types/search-api/search-results';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { FeatureSearchMode } from 'src/shared/helpers/featureSearchHelpers';

import styles from './FeatureSearchResults.module.css';

type SearchMatchesWithSpecies = {
  speciesInfo: CommittedItem;
  searchMatches: SearchMatch[];
};

const getGroupedSearchMatches = (
  speciesList: CommittedItem[],
  searchMatches: SearchMatch[]
) => {
  const searchMatchesMap = new Map<string, SearchMatchesWithSpecies>(); // will preserve insertion order, i.e. the order of committed species
  speciesList.forEach((species) => {
    searchMatchesMap.set(species.genome_id, {
      speciesInfo: species,
      searchMatches: []
    });
  });

  searchMatches.forEach((match) => {
    const matches = searchMatchesMap.get(match.genome_id)?.searchMatches;
    if (matches) {
      matches.push(match);
    }
  });

  // return only those species/search matches combos that actually have search matches
  return [...searchMatchesMap.values()].filter(
    ({ searchMatches }) => searchMatches.length
  );
};

export const FeatureSearchResults = (props: {
  speciesList: CommittedItem[];
  featureSearchMode: FeatureSearchMode;
  searchResults?: SearchResults;
  scrollable?: boolean;
  emptyResultsLabel?: string;
  showFeatureActions?: boolean;
}) => {
  const {
    featureSearchMode,
    speciesList,
    searchResults,
    scrollable = true,
    emptyResultsLabel,
    showFeatureActions = false
  } = props;

  if (!searchResults) {
    return;
  }

  if (searchResults?.matches.length === 0) {
    return (
      <NoResults
        featureSearchMode={featureSearchMode}
        emptyResultsLabel={emptyResultsLabel}
      />
    );
  }

  const groupedSearchMatches = getGroupedSearchMatches(
    speciesList,
    searchResults.matches
  );

  const isGeneSearchMode = featureSearchMode === 'gene';
  const isTranscriptSearchMode = featureSearchMode === 'transcript';
  const isVariantSearchMode = featureSearchMode === 'variant';
  const showReleaseColumns =
    isGeneSearchMode || isTranscriptSearchMode || isVariantSearchMode;
  const capitalizedFeatureSearchMode =
    featureSearchMode.charAt(0).toUpperCase() + featureSearchMode.slice(1);

  return (
    <div
      className={classNames(styles.resultsWrapper, {
        [styles.resultsWrapperAutoHeight]: !scrollable
      })}
    >
      <Table stickyHeader={true} className={styles.resultsTable}>
        <thead>
          <tr>
            <th>
              Found in
              <span className={styles.speciesCount}>
                {groupedSearchMatches.length}
              </span>
              species
            </th>
            {showReleaseColumns && (
              <>
                <th>Release date</th>
                <th>Release type</th>
                <th>Assembly accession</th>
              </>
            )}
            <th>{capitalizedFeatureSearchMode}</th>
            {showFeatureActions && <th>Genome Browser</th>}
            {showFeatureActions && <th>Entity Viewer</th>}
          </tr>
        </thead>
        <tbody>
          {groupedSearchMatches.map((match) => (
            <FeatureSearchTableRows
              key={match.speciesInfo.genome_id}
              data={match}
              featureSearchMode={featureSearchMode}
              showFeatureActions={showFeatureActions}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const FeatureSearchTableRows = (props: {
  data: SearchMatchesWithSpecies;
  featureSearchMode: FeatureSearchMode;
  showFeatureActions?: boolean;
}) => {
  const { featureSearchMode, data, showFeatureActions = false } = props;
  const { speciesInfo, searchMatches } = data;

  const isGeneSearchMode = featureSearchMode === 'gene';
  const isTranscriptSearchMode = featureSearchMode === 'transcript';
  const isVariantSearchMode = featureSearchMode === 'variant';
  const showReleaseColumns =
    isGeneSearchMode || isTranscriptSearchMode || isVariantSearchMode;

  return (
    <>
      {searchMatches.map((match, index) => {
        const isFirstRow = index === 0;
        const rowSpan = searchMatches.length;
        return (
          <tr key={index}>
            {isFirstRow && (
              <>
                <td rowSpan={rowSpan}>
                  <SpeciesName
                    species={speciesInfo}
                    className={styles.speciesName}
                  />
                </td>
                {showReleaseColumns && (
                  <>
                    <td rowSpan={rowSpan}>{speciesInfo.release.name}</td>
                    <td rowSpan={rowSpan}>{speciesInfo.release.type}</td>
                    <td rowSpan={rowSpan}>
                      {speciesInfo.assembly.accession_id}
                    </td>
                  </>
                )}
              </>
            )}
            <td>
              <div className={styles.featureMatch}>
                {isGeneSearchMode && (
                  <GeneRecord match={match} species={speciesInfo} />
                )}
                {isTranscriptSearchMode && (
                  <TranscriptRecord match={match} species={speciesInfo} />
                )}
                {isVariantSearchMode && (
                  <VariantSearchRecord match={match} species={speciesInfo} />
                )}
              </div>
            </td>
            {showFeatureActions && (
              <>
                <td className={styles.featureActionCell}>
                  <div className={styles.featureActionCellContent}>
                    <FeatureSearchActionButton
                      featureSearchMode={featureSearchMode}
                      match={match}
                      species={speciesInfo}
                      appName="genomeBrowser"
                    />
                  </div>
                </td>
                <td className={styles.featureActionCell}>
                  <div className={styles.featureActionCellContent}>
                    <FeatureSearchActionButton
                      featureSearchMode={featureSearchMode}
                      match={match}
                      species={speciesInfo}
                      appName="entityViewer"
                    />
                  </div>
                </td>
              </>
            )}
          </tr>
        );
      })}
    </>
  );
};

const TranscriptRecord = (props: {
  match: SearchMatch;
  species: CommittedItem;
}) => {
  const { match, species } = props as {
    match: TranscriptSearchMatch;
    species: CommittedItem;
  };
  const genomeBrowserUrl = getFeatureSearchLinks('transcript', match, species)
    .genomeBrowser.url;

  return (
    <SearchResultLabel className={styles.transcriptMatch} to={genomeBrowserUrl}>
      <span className={styles.stableId}>{match.stable_id}</span>
      {match.symbol && (
        <span className={styles.transcriptSymbol}>{match.symbol}</span>
      )}
    </SearchResultLabel>
  );
};

const VariantSearchRecord = (props: {
  match: SearchMatch;
  species: CommittedItem;
}) => {
  const { match, species } = props as {
    match: VariantSearchMatch;
    species: CommittedItem;
  };
  const genomeBrowserUrl = getFeatureSearchLinks('variant', match, species)
    .genomeBrowser.url;

  return (
    <SearchResultLabel className={styles.variantMatch} to={genomeBrowserUrl}>
      {match.variant_name}
    </SearchResultLabel>
  );
};

const GeneRecord = (props: { match: SearchMatch; species: CommittedItem }) => {
  const { match, species } = props as {
    match: GeneSearchMatch;
    species: CommittedItem;
  };
  const genomeBrowserUrl = getFeatureSearchLinks('gene', match, species)
    .genomeBrowser.url;

  return (
    <SearchResultLabel className={styles.geneMatch} to={genomeBrowserUrl}>
      {match.symbol && (
        <span className={styles.geneSymbol}>{match.symbol}</span>
      )}
      <span className={styles.stableId}>{match.stable_id}</span>
    </SearchResultLabel>
  );
};

const SearchResultLabel = (props: {
  className: string;
  children: ReactNode;
  to?: string;
}) => {
  if (props.to) {
    return (
      <Link to={props.to} className={props.className}>
        {props.children}
      </Link>
    );
  }

  return <span className={props.className}>{props.children}</span>;
};

const FeatureSearchActionButton = (props: {
  featureSearchMode: FeatureSearchMode;
  match: SearchMatch;
  species: CommittedItem;
  appName: 'genomeBrowser' | 'entityViewer';
}) => {
  const { featureSearchMode, match, species, appName } = props;
  const links = getFeatureSearchLinks(featureSearchMode, match, species);
  const link = links[appName];
  const compactLinks =
    appName === 'genomeBrowser'
      ? { genomeBrowser: link }
      : { entityViewer: link };

  return <ViewInApp compact links={compactLinks} />;
};

const getFeatureSearchLinks = (
  featureSearchMode: FeatureSearchMode,
  match: SearchMatch,
  species: CommittedItem
) => {
  const genomeIdForUrl = species.genome_tag || species.genome_id;

  if (featureSearchMode === 'variant') {
    const variantMatch = match as VariantSearchMatch;
    const variantIdForUrl = `${variantMatch.region_name}:${variantMatch.start}:${variantMatch.variant_name}`;

    return {
      genomeBrowser: {
        url: urlFor.browser({
          genomeId: genomeIdForUrl,
          focus: buildFocusIdForUrl({
            type: 'variant',
            objectId: variantIdForUrl
          })
        })
      },
      entityViewer: {
        url: urlFor.entityViewer({
          genomeId: genomeIdForUrl,
          entityId: buildFocusIdForUrl({
            type: 'variant',
            objectId: variantIdForUrl
          })
        })
      }
    };
  }

  if (featureSearchMode === 'gene') {
    const geneMatch = match as GeneSearchMatch;
    return {
      genomeBrowser: {
        url: urlFor.browser({
          genomeId: genomeIdForUrl,
          focus: buildFocusIdForUrl({
            type: 'gene',
            objectId: geneMatch.unversioned_stable_id
          })
        })
      },
      entityViewer: {
        url: urlFor.entityViewer({
          genomeId: genomeIdForUrl,
          entityId: buildFocusIdForUrl({
            type: 'gene',
            objectId: geneMatch.unversioned_stable_id
          })
        })
      }
    };
  }

  const transcriptMatch = match as TranscriptSearchMatch;
  return {
    genomeBrowser: {
      url: urlFor.browser({
        genomeId: genomeIdForUrl,
        focus: buildFocusIdForUrl({
          type: 'transcript',
          objectId: transcriptMatch.unversioned_stable_id
        })
      })
    },
    entityViewer: {
      url: urlFor.entityViewer({
        genomeId: genomeIdForUrl,
        entityId: buildFocusIdForUrl({
          type: 'transcript',
          objectId: transcriptMatch.unversioned_stable_id
        })
      })
    }
  };
};

export const NoResults = (props: {
  featureSearchMode: string;
  emptyResultsLabel?: string;
}) => {
  const { emptyResultsLabel } = props;

  if (emptyResultsLabel) {
    return (
      <div className={styles.noResults}>
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className={styles.noResults}>
      <p>
        Found in <span className={styles.speciesCount}>0</span> species
      </p>
      <p className={styles.warning}>
        Sorry, we can’t find this {props.featureSearchMode} in any of your
        species in use
      </p>
      <p>Please use a different {props.featureSearchMode} identifier</p>
    </div>
  );
};
