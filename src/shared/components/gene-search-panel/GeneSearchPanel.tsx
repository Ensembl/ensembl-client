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

import React, {
  useState,
  useRef,
  type FormEvent,
  type ChangeEvent,
  type ReactNode
} from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import { useAppSelector } from 'src/store';

import { useLazySearchGenesQuery } from 'src/shared/state/api-slices/searchApiSlice';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { PrimaryButton } from 'src/shared/components/button/Button';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import PointerBox, {
  Position as PointerBoxPosition
} from 'src/shared/components/pointer-box/PointerBox';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { SearchResults } from 'src/shared/types/search-api/search-results';
import type { SearchMatch } from 'src/shared/types/search-api/search-match';

import styles from './GeneSearchPanel.module.css';
import radioStyles from 'src/shared/components/radio-group/RadioGroup.module.css';

type Props = {
  onClose: () => void;
};

const GeneSearchPanel = (props: Props) => {
  return (
    <Panel {...props}>
      <Main />
    </Panel>
  );
};

/**
 * This component will likely be extracted into its own shared component.
 * Its responsibility is to create a 100%-high grey div with a close button and space for children
 * I am not sure what its name is going to be. "Panel" is taken (not that it's a very descriptive name anyway).
 */
const Panel = (props: { onClose: () => void; children: ReactNode }) => {
  return (
    <div className={styles.panel}>
      {props.children}
      <CloseButton className={styles.closeButton} onClick={props.onClose} />
    </div>
  );
};

const Main = () => {
  const [searchTrigger, searchResult] = useLazySearchGenesQuery();
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const { currentData: currentSearchResults } = searchResult;

  return (
    <div className={styles.main}>
      <GeneSearchForm onSearch={searchTrigger} species={committedSpecies} />
      {currentSearchResults && (
        <GeneSearchResults
          speciesList={committedSpecies}
          searchResults={currentSearchResults}
        />
      )}
    </div>
  );
};

const GeneSearchForm = (props: {
  species: CommittedItem[];
  onSearch: ReturnType<typeof useLazySearchGenesQuery>[0];
}) => {
  const queryRef = useRef('');

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const genomeIds = props.species.map(({ genome_id }) => genome_id);

    props.onSearch({
      genome_ids: genomeIds,
      query: queryRef.current,
      page: 1,
      per_page: 50
    });
  };

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    queryRef.current = event.target.value;
  };

  // FIXME: update the Button component to not require onClick property
  return (
    <div>
      <form className={styles.geneSearchForm} onSubmit={onFormSubmit}>
        <label className={styles.searchLabel}>Find a gene</label>
        <ShadedInput
          className={styles.searchField}
          size="large"
          onChange={onQueryChange}
        />
        <PrimaryButton type="submit" className={styles.submit} onClick={noop}>
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
          classNames={{ box: styles.tooltip, pointer: styles.tooltipTip }}
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

export default GeneSearchPanel;
