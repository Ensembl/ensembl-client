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

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { getSpeciesSelectorModalView } from 'src/content/app/new-species-selector/state/species-selector-ui-slice/speciesSelectorUISelectors';

import { setModalView } from 'src/content/app/new-species-selector/state/species-selector-ui-slice/speciesSelectorUISlice';

import AppBar from 'src/shared/components/app-bar/AppBar';
import { HelpPopupButton } from 'src/shared/components/help-popup';
import SpeciesLozenge from 'src/shared/components/selected-species/SpeciesLozenge';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';
import GeneSearchButton from 'src/shared/components/gene-search-button/GeneSearchButton';
import GeneSearchCloseButton from 'src/shared/components/gene-search-button/GeneSearchCloseButton';

import type { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSelectorAppBar.scss';

export const placeholderMessage =
  'Find and add your favourite species to use them across the site';

const PlaceholderMessage = () => (
  <div className={styles.placeholderMessage}>{placeholderMessage}</div>
);

export const SpeciesSelectorAppBar = () => {
  const selectedSpecies = useAppSelector(getCommittedSpecies);

  const mainContent =
    selectedSpecies.length > 0 ? (
      <SelectedSpeciesList selectedSpecies={selectedSpecies} />
    ) : (
      <PlaceholderMessage />
    );

  return (
    <AppBar
      appName="Species Selector"
      mainContent={mainContent}
      aside={<HelpPopupButton slug="species-selector-intro" />}
    />
  );
};

const SelectedSpeciesList = (props: { selectedSpecies: CommittedItem[] }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isInGeneSearchMode =
    useAppSelector(getSpeciesSelectorModalView) === 'find-gene';

  const onGeneSearchOpen = () => {
    dispatch(setModalView('find-gene'));
  };

  const onGeneSearchClose = () => {
    dispatch(setModalView(null));
  };

  const showSpeciesPage = (species: CommittedItem) => {
    const genomeIdForUrl = species.genome_tag ?? species.genome_id;
    const speciesPageUrl = urlFor.speciesPage({
      genomeId: genomeIdForUrl
    });

    navigate(speciesPageUrl);
  };

  const conditionalSpeciesProps = !isInGeneSearchMode
    ? ({ onClick: showSpeciesPage, theme: 'blue' } as const)
    : ({ theme: 'grey' } as const);

  const selectedSpecies = props.selectedSpecies.map((species) => (
    <SpeciesLozenge
      key={species.genome_id}
      species={species}
      {...conditionalSpeciesProps}
    />
  ));

  const geneSearchButton = isInGeneSearchMode ? (
    <GeneSearchCloseButton key="find-a-gene" onClick={onGeneSearchClose} />
  ) : (
    <GeneSearchButton key="find-a-gene" onClick={onGeneSearchOpen} />
  );

  const speciesTabsWrapperContent = [...selectedSpecies, geneSearchButton];

  return <SpeciesTabsWrapper speciesTabs={speciesTabsWrapperContent} />;
};

export default SpeciesSelectorAppBar;
