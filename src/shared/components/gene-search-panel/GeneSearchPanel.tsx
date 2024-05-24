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

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type ChangeEvent
} from 'react';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import { useAppSelector } from 'src/store';

import { useLazySearchGenesQuery } from 'src/shared/state/api-slices/searchApiSlice';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { PrimaryButton } from 'src/shared/components/button/Button';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import PointerBox, {
  Position as PointerBoxPosition
} from 'src/shared/components/pointer-box/PointerBox';
import ModalView from 'src/shared/components/modal-view/ModalView';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { SearchResults } from 'src/shared/types/search-api/search-results';
import type { SearchMatch } from 'src/shared/types/search-api/search-match';

import styles from './GeneSearchPanel.module.css';
import radioStyles from 'src/shared/components/radio-group/RadioGroup.module.css';
import pointerBoxStyles from 'src/shared/components/pointer-box/PointerBox.module.css';

type Props = {
  query: string;
  onClose: () => void;
  onSearchSubmit: (query: string) => void;
};

const GeneSearchPanel = (props: Props) => {
  return (
    <ModalView {...props}>
      <Main {...props} />
    </ModalView>
  );
};

const Main = (props: Props) => {
  const { query, onSearchSubmit } = props;
  const [searchTrigger, searchResult] = useLazySearchGenesQuery();
  const committedSpecies = useAppSelector(getCommittedSpecies);

  const { currentData: currentSearchResults } = searchResult;
  const genomeIds = committedSpecies.map(({ genome_id }) => genome_id);

  useEffect(() => {
    if (!query) {
      return;
    }
    searchTrigger({
      genome_ids: genomeIds,
      query,
      page: 1,
      per_page: 50
    });
  }, [query]);

  return (
    <div className={styles.main}>
      <GeneSearchForm
        onSearchSubmit={onSearchSubmit}
        species={committedSpecies}
        query={query}
      />
      {!!currentSearchResults?.matches.length && (
        <GeneSearchResults
          speciesList={committedSpecies}
          searchResults={currentSearchResults}
        />
      )}
      {currentSearchResults?.matches.length === 0 && <NoResults />}
    </div>
  );
};

const GeneSearchForm = (props: {
  species: CommittedItem[];
  onSearchSubmit: (query: string) => void;
  query: string;
}) => {
  const [searchInput, setSearchInput] = useState(props.query);
  const [shouldDisableSubmit, setShouldDisableSubmit] = useState(true);

  useEffect(() => {
    if (props.query !== searchInput) {
      setSearchInput(props.query);
    }
  }, [props.query]);

  // NOTE: future versions of React will stop passing null to ref callbacks; so update function signature when this happens
  const focusInput = (input: HTMLInputElement | null) => {
    input && input.focus();
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShouldDisableSubmit(true);

    props.onSearchSubmit(searchInput);
  };

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setSearchInput(newQuery);
    setShouldDisableSubmit(!newQuery);
  };

  return (
    <div>
      <form className={styles.geneSearchForm} onSubmit={onFormSubmit}>
        <label className={styles.searchLabel}>Find a gene</label>
        <ShadedInput
          className={styles.searchField}
          size="large"
          onChange={onQueryChange}
          value={searchInput || ''}
          help="Find a gene using a stable ID (versioned or un-versioned), symbol or synonym"
          type="search"
          ref={focusInput}
        />
        <PrimaryButton
          type="submit"
          className={styles.submit}
          disabled={shouldDisableSubmit}
        >
          Go
        </PrimaryButton>
      </form>
      <SearchScope />
    </div>
  );
};

// NOTE: so far, this element is decorative; user won't be able to change the scope anyway
const SearchScope = () => {
  // FIXME: when doing this for real, use the RadioGroup component
  // (note that RadioGroup doesn't have disabled radios)
  return (
    <div className={styles.pseudoRadioGroup}>
      <div className={radioStyles.radioGroupItem}>
        <span
          className={classNames(radioStyles.radio, radioStyles.radioChecked)}
        />
        <span className={radioStyles.label}>Only species in list</span>
      </div>
      <div
        className={classNames(
          radioStyles.radioGroupItem,
          styles.pseudoRadioDisabled
        )}
      >
        <span className={radioStyles.radio} />
        <span className={radioStyles.label}>All Ensembl</span>
      </div>
    </div>
  );
};

const GeneSearchResults = (props: {
  speciesList: CommittedItem[];
  searchResults: SearchResults;
}) => {
  const groupedSearchMatches = getGroupedSearchMatches(
    props.speciesList,
    props.searchResults.matches
  );

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
            <th>Gene</th>
          </tr>
        </thead>
        <tbody>
          {groupedSearchMatches.map((match) => (
            <GeneSearchTableRows
              key={match.speciesInfo.genome_id}
              data={match}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GeneSearchTableRows = (props: { data: SearchMatchesWithSpecies }) => {
  const { speciesInfo, searchMatches } = props.data;

  const speciesElement = (
    <div className={styles.speciesCell}>
      <span>{speciesInfo.common_name ?? speciesInfo.scientific_name}</span>
      <span className={styles.assemblyName}>{speciesInfo.assembly.name}</span>
    </div>
  );

  if (searchMatches.length === 1) {
    return (
      <tr>
        <td>{speciesElement}</td>
        <td>
          <GeneMatch match={searchMatches[0]} species={speciesInfo} />
        </td>
      </tr>
    );
  } else {
    return (
      <>
        {searchMatches.map((match, index) => (
          <tr key={index}>
            {index === 0 && (
              <td rowSpan={searchMatches.length}>{speciesElement}</td>
            )}
            <td>
              <GeneMatch match={match} species={speciesInfo} />
            </td>
          </tr>
        ))}
      </>
    );
  }
};

const GeneMatch = (props: { match: SearchMatch; species: CommittedItem }) => {
  const {
    match: { unversioned_stable_id },
    species: { genome_tag, genome_id }
  } = props;
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  const genomeIdForUrl = genome_tag || genome_id;

  const handleClick = () => {
    setShouldShowTooltip(!shouldShowTooltip);
  };

  const urlForGenomeBrowser = urlFor.browser({
    genomeId: genomeIdForUrl,
    focus: buildFocusIdForUrl({ type: 'gene', objectId: unversioned_stable_id })
  });

  const urlForEntityViewer = urlFor.entityViewer({
    genomeId: genomeIdForUrl,
    entityId: buildFocusIdForUrl({
      type: 'gene',
      objectId: unversioned_stable_id
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
        {props.match.stable_id}
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

const NoResults = () => {
  return (
    <div className={styles.noResults}>
      <p>
        Found in <span className={styles.speciesCount}>0</span> species
      </p>
      <p className={styles.warning}>
        Sorry, we can’t find this gene in any of your species in use
      </p>
      <p>Please use a different gene identifier</p>
    </div>
  );
};

export default GeneSearchPanel;
