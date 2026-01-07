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

import { useState, useRef } from 'react';
import classNames from 'classnames';

import { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import {
  GeneSearchMatch,
  SearchMatch,
  VariantSearchMatch
} from 'src/shared/types/search-api/search-match';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import { SearchResults } from 'src/shared/types/search-api/search-results';
import PointerBox, {
  Position as PointerBoxPosition
} from 'src/shared/components/pointer-box/PointerBox';
import ViewInApp from '../view-in-app/ViewInApp';

import styles from './FeatureSearchResult.module.css';
import pointerBoxStyles from 'src/shared/components/pointer-box/PointerBox.module.css';
import { FeatureSearchModeType } from 'src/shared/types/search-api/search-constants';
import SpeciesName from '../species-name/SpeciesName';

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
  featureSearchMode: string;
  searchResults?: SearchResults;
}) => {
  const { featureSearchMode, speciesList, searchResults } = props;

  if (!searchResults) {
    return;
  }

  if (searchResults?.matches.length === 0) {
    return <NoResults featureSearchMode={featureSearchMode} />;
  }

  const groupedSearchMatches = getGroupedSearchMatches(
    speciesList,
    searchResults.matches
  );

  const isGeneSearchMode =
    featureSearchMode === FeatureSearchModeType.GENE_SEARCH_MODE;

  return (
    <div className={styles.resultsWrapper}>
      <table className={styles.resultsTable}>
        <thead>
          <tr>
            <th>
              Found in
              <span className={styles.speciesCount}>
                {groupedSearchMatches.length}
              </span>
              species
            </th>
            {
              isGeneSearchMode && (
                <>
                  <th>Release date</th>
                  <th>Release type</th>
                  <th>Assembly accession</th>
                </>
              )
            }
            <th>{featureSearchMode}</th>
          </tr>
        </thead>
        <tbody>
          {groupedSearchMatches.map((match) => (
            <FeatureSearchTableRows
              key={match.speciesInfo.genome_id}
              data={match}
              featureSearchMode={featureSearchMode}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FeatureSearchTableRows = (props: {
  data: SearchMatchesWithSpecies;
  featureSearchMode: string;
}) => {
  const { featureSearchMode, data } = props;
  const { speciesInfo, searchMatches } = data;

  const isGeneSearchMode =
    featureSearchMode === FeatureSearchModeType.GENE_SEARCH_MODE;
  const isVariantSearchMode =
    featureSearchMode === FeatureSearchModeType.VARIANT_SEARCH_MODE;

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
                {isGeneSearchMode && (
                  <>
                    <td rowSpan={rowSpan}>{speciesInfo.release.name}</td>
                    <td rowSpan={rowSpan}>{speciesInfo.release.type}</td>
                    <td rowSpan={rowSpan}>{speciesInfo.assembly.accession_id}</td>
                  </>
                )}
              </>
            )}
            <td>
              {isGeneSearchMode && <GeneRecord match={match} species={speciesInfo} />}
              {isVariantSearchMode && <VariantSearchRecord match={match} species={speciesInfo} />}
            </td>
          </tr>
        )
      })}
    </>
  );
};

const VariantSearchRecord = (props: {
  match: SearchMatch;
  species: CommittedItem;
}) => {
  const {
    match,
    species: { genome_tag, genome_id }
  } = props as { match: VariantSearchMatch; species: CommittedItem };

  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  const genomeIdForUrl = genome_tag || genome_id;
  const variantIdForUrl = `${match.region_name}:${match.start}:${match.variant_name}`;

  const handleClick = () => {
    setShouldShowTooltip(!shouldShowTooltip);
  };

  const urlForGenomeBrowser = urlFor.browser({
    genomeId: genomeIdForUrl,
    focus: buildFocusIdForUrl({ type: 'variant', objectId: variantIdForUrl })
  });

  const urlForEntityViewer = urlFor.entityViewer({
    genomeId: genomeIdForUrl,
    entityId: buildFocusIdForUrl({
      type: 'variant',
      objectId: variantIdForUrl
    })
  });

  // NOTE: If this panel opens in genome browser, we should add `replaceState: true`
  // to the genomeBrowser link config below
  const links = {
    genomeBrowser: {
      url: urlForGenomeBrowser
    },
    entityViewer: {
      url: urlForEntityViewer
    }
  };

  return (
    <div>
      <span
        className={styles.variantMatch}
        ref={anchorRef}
        onClick={handleClick}
      >
        {match.variant_name}
      </span>
      {shouldShowTooltip && anchorRef.current && (
        <PointerBox
          anchor={anchorRef.current}
          className={classNames(
            styles.tooltip,
            pointerBoxStyles.pointerBoxShadow
          )}
          position={PointerBoxPosition.RIGHT_TOP}
          onOutsideClick={handleClick}
        >
          <ViewInApp theme="dark" links={links} />
        </PointerBox>
      )}
    </div>
  );
};

const GeneRecord = (props: { match: SearchMatch; species: CommittedItem }) => {
  const {
    match,
    species: { genome_tag, genome_id }
  } = props as { match: GeneSearchMatch; species: CommittedItem };
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  const genomeIdForUrl = genome_tag || genome_id;

  const handleClick = () => {
    setShouldShowTooltip(!shouldShowTooltip);
  };

  const urlForGenomeBrowser = urlFor.browser({
    genomeId: genomeIdForUrl,
    focus: buildFocusIdForUrl({
      type: 'gene',
      objectId: match.unversioned_stable_id
    })
  });

  const urlForEntityViewer = urlFor.entityViewer({
    genomeId: genomeIdForUrl,
    entityId: buildFocusIdForUrl({
      type: 'gene',
      objectId: match.unversioned_stable_id
    })
  });

  // NOTE: If this panel opens in genome browser, we should add `replaceState: true`
  // to the genomeBrowser link config below
  const links = {
    genomeBrowser: {
      url: urlForGenomeBrowser
    },
    entityViewer: {
      url: urlForEntityViewer
    }
  };

  return (
    <>
      <span className={styles.geneMatch} ref={anchorRef} onClick={handleClick}>
        <span className={styles.geneSymbol}>{match.symbol}</span>
        <span className={styles.stableId}>{match.stable_id}</span>
      </span>
      {shouldShowTooltip && anchorRef.current && (
        <PointerBox
          anchor={anchorRef.current}
          className={classNames(
            styles.tooltip,
            pointerBoxStyles.pointerBoxShadow
          )}
          position={PointerBoxPosition.RIGHT_TOP}
          onOutsideClick={handleClick}
        >
          <ViewInApp theme="dark" links={links} />
        </PointerBox>
      )}
    </>
  );
};

export const NoResults = (props: { featureSearchMode: string }) => {
  const featureSearchModeLower = props.featureSearchMode.toLowerCase();

  return (
    <div className={styles.noResults}>
      <p>
        Found in <span className={styles.speciesCount}>0</span> species
      </p>
      <p className={styles.warning}>
        Sorry, we can’t find this {featureSearchModeLower} in any of your
        species in use
      </p>
      <p>Please use a different {featureSearchModeLower} identifier</p>
    </div>
  );
};
