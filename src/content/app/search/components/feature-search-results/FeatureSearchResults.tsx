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

import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import { Table } from 'src/shared/components/table';
import SpeciesName from 'src/shared/components/species-name/SpeciesName';
import {
  GenomeBrowserIcon,
  EntityViewerIcon
} from 'src/shared/components/app-icon';

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
  featureType: FeatureSearchMode;
  searchResults?: SearchResults;
}) => {
  const { featureType, speciesList, searchResults } = props;

  if (!searchResults || searchResults.matches.length === 0) {
    return <NoResults />;
  }

  const groupedSearchMatches = getGroupedSearchMatches(
    speciesList,
    searchResults.matches
  );

  return (
    <div className={styles.resultsWrapper}>
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
            <th>Release date</th>
            <th>Release type</th>
            <th>Assembly accession</th>
            <th>
              <span className={styles.capitalized}>{featureType}</span>
            </th>
            <th>Genome Browser</th>
            <th>Entity Viewer</th>
          </tr>
        </thead>
        <tbody>
          {groupedSearchMatches.map((match) => (
            <FeatureSearchTableRows
              key={match.speciesInfo.genome_id}
              data={match}
              featureType={featureType}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const FeatureSearchTableRows = (props: {
  data: SearchMatchesWithSpecies;
  featureType: FeatureSearchMode;
}) => {
  const { featureType, data } = props;
  const { speciesInfo, searchMatches } = data;

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
                <td rowSpan={rowSpan}>{speciesInfo.release.name}</td>
                <td rowSpan={rowSpan}>{speciesInfo.release.type}</td>
                <td rowSpan={rowSpan}>{speciesInfo.assembly.accession_id}</td>
              </>
            )}
            <td>
              {featureType === 'gene' && (
                <GeneRecord match={match} species={speciesInfo} />
              )}
              {featureType === 'transcript' && (
                <TranscriptRecord match={match} species={speciesInfo} />
              )}
              {featureType === 'variant' && (
                <VariantSearchRecord match={match} species={speciesInfo} />
              )}
            </td>
            <td className={styles.tableCellForButton}>
              <FeatureSearchActionButton
                featureType={featureType}
                match={match}
                species={speciesInfo}
                appName="genomeBrowser"
              />
            </td>
            <td className={styles.tableCellForButton}>
              <FeatureSearchActionButton
                featureType={featureType}
                match={match}
                species={speciesInfo}
                appName="entityViewer"
              />
            </td>
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
      <span className={styles.stableId}>{match.stable_id} </span>
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
        <span className={styles.geneSymbol}>{match.symbol} </span>
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
      <Link to={props.to} className={styles.resultLabel}>
        {props.children}
      </Link>
    );
  }

  return <span className={props.className}>{props.children}</span>;
};

const FeatureSearchActionButton = (props: {
  featureType: FeatureSearchMode;
  match: SearchMatch;
  species: CommittedItem;
  appName: 'genomeBrowser' | 'entityViewer';
}) => {
  const { featureType, match, species, appName } = props;
  const links = getFeatureSearchLinks(featureType, match, species);

  if (appName === 'genomeBrowser') {
    return (
      <Link to={links.genomeBrowser.url} aria-label="view in genome browser">
        <GenomeBrowserIcon className={styles.appIcon} />
      </Link>
    );
  } else if (appName === 'entityViewer') {
    return (
      <Link to={links.entityViewer.url} aria-label="view in entity viewer">
        <EntityViewerIcon className={styles.appIcon} />
      </Link>
    );
  }
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

export const NoResults = () => {
  return (
    <div className={styles.noResults}>
      <p>No results found</p>
    </div>
  );
};
