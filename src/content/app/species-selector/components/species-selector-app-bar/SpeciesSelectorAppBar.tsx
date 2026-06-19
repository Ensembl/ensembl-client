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

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import { deleteSpeciesAndSave } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { HelpPopupButton } from 'src/shared/components/help-popup';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import { CloseButtonWithLabel } from 'src/shared/components/close-button/CloseButton';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './SpeciesSelectorAppBar.module.css';

export const placeholderMessage =
  'Find and add your favourite species to use them across the site';

export const PlaceholderMessage = () => (
  <div className={styles.placeholderMessage}>{placeholderMessage}</div>
);

export const SpeciesSelectorAppBar = (props: { isSearchMode?: boolean }) => {
  const enabledCommittedSpecies = useAppSelector(getEnabledCommittedSpecies);
  const hasEnabledSpecies = enabledCommittedSpecies.length > 0;

  const mainContent = hasEnabledSpecies ? (
    <AppBarMainContent
      selectedSpecies={enabledCommittedSpecies}
      isSearchMode={props.isSearchMode}
    />
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

const AppBarMainContent = (props: {
  selectedSpecies: CommittedItem[];
  isSearchMode?: boolean;
}) => {
  const navigate = useNavigate();

  const onSearchClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.grid}>
      <SelectedSpeciesList
        selectedSpecies={props.selectedSpecies}
        isSearchMode={props.isSearchMode}
      />
      <div className={styles.aside}>
        {props.isSearchMode && <CloseButtonWithLabel onClick={onSearchClose} />}
        {!props.isSearchMode && (
          <span className={styles.selectTabMessage}>
            Select a tab to see a Species home page
          </span>
        )}
      </div>
    </div>
  );
};

const SelectedSpeciesList = (props: {
  selectedSpecies: CommittedItem[];
  isSearchMode?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const showSpeciesPage = (species: CommittedItem) => {
    const genomeIdForUrl = species.genome_tag ?? species.genome_id;
    const speciesPageUrl = urlFor.speciesPage({
      genomeId: genomeIdForUrl
    });

    navigate(speciesPageUrl);
  };

  const removeSpecies = (species: CommittedItem) => {
    dispatch(deleteSpeciesAndSave(species.genome_id));
  };

  const conditionalSpeciesProps = !props.isSearchMode
    ? ({ theme: 'blue' } as const)
    : ({ theme: 'grey', disabled: true } as const);

  const selectedSpecies = props.selectedSpecies.map((species) => (
    <SelectedSpecies
      key={species.genome_id}
      species={species}
      onClick={() => showSpeciesPage(species)}
      onRemove={!props.isSearchMode ? removeSpecies : undefined}
      {...conditionalSpeciesProps}
    />
  ));

  return <SpeciesTabsSlider>{selectedSpecies}</SpeciesTabsSlider>;
};

export default SpeciesSelectorAppBar;
