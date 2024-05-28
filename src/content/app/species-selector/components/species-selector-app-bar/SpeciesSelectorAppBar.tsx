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

import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import { getQuery as readStoredGeneQuery } from 'src/content/app/species-selector/state/species-selector-gene-search-slice/speciesSelectorGeneSearchSelectors';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { HelpPopupButton } from 'src/shared/components/help-popup';
import GeneSearchButton from 'src/shared/components/gene-search-button/GeneSearchButton';
import GeneSearchCloseButton from 'src/shared/components/gene-search-button/GeneSearchCloseButton';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './SpeciesSelectorAppBar.module.css';

export const placeholderMessage =
  'Find and add your favourite species to use them across the site';

export const PlaceholderMessage = () => (
  <div className={styles.placeholderMessage}>{placeholderMessage}</div>
);

export const SpeciesSelectorAppBar = () => {
  const enabledCommittedSpecies = useAppSelector(getEnabledCommittedSpecies);

  const mainContent =
    enabledCommittedSpecies.length > 0 ? (
      <AppBarMainContent selectedSpecies={enabledCommittedSpecies} />
    ) : (
      <PlaceholderMessage />
    );

  return (
    <AppBar
      topLeft={<AppName>Species Selector</AppName>}
      topRight={<SpeciesManagerIndicator />}
      mainContent={mainContent}
      aside={<HelpPopupButton slug="species-selector-intro" />}
    />
  );
};

const AppBarMainContent = (props: { selectedSpecies: CommittedItem[] }) => {
  const storedGeneSearchQuery = useAppSelector(readStoredGeneQuery);
  const navigate = useNavigate();
  const location = useLocation();
  const isInGeneSearchMode = location.pathname.includes('/search/gene');

  const onGeneSearchOpen = () => {
    navigate(urlFor.speciesSelectorGeneSearch(storedGeneSearchQuery));
  };

  const onGeneSearchClose = () => {
    navigate(-1);
  };

  const geneSearchButton = !isInGeneSearchMode ? (
    <GeneSearchButton onClick={onGeneSearchOpen} />
  ) : (
    <GeneSearchCloseButton onClick={onGeneSearchClose} />
  );

  return (
    <div className={styles.grid}>
      <SelectedSpeciesList selectedSpecies={props.selectedSpecies} />
      <div className={styles.aside}>
        {geneSearchButton}
        {!isInGeneSearchMode && (
          <span className={styles.selectTabMessage}>
            Select a tab to see a Species home page
          </span>
        )}
      </div>
    </div>
  );
};

const SelectedSpeciesList = (props: { selectedSpecies: CommittedItem[] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInGeneSearchMode = location.pathname.includes('/search/gene');

  const showSpeciesPage = (species: CommittedItem) => {
    const genomeIdForUrl = species.genome_tag ?? species.genome_id;
    const speciesPageUrl = urlFor.speciesPage({
      genomeId: genomeIdForUrl
    });

    navigate(speciesPageUrl);
  };

  const conditionalSpeciesProps = !isInGeneSearchMode
    ? ({ theme: 'blue' } as const)
    : ({ theme: 'grey', disabled: true } as const);

  const selectedSpecies = props.selectedSpecies.map((species) => (
    <SelectedSpecies
      key={species.genome_id}
      species={species}
      onClick={() => showSpeciesPage(species)}
      {...conditionalSpeciesProps}
    />
  ));

  return <SpeciesTabsSlider>{selectedSpecies}</SpeciesTabsSlider>;
};

export default SpeciesSelectorAppBar;
