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

import { useAppDispatch, useAppSelector } from 'src/store';

import {
  getSpeciesSearchQuery,
  getSelectedPopularSpecies
} from 'src/content/app/new-species-selector/state/species-selector-search-slice/speciesSelectorSearchSelectors';
import { getSpeciesSelectorModalView } from 'src/content/app/new-species-selector/state/species-selector-ui-slice/speciesSelectorUISelectors';

import {
  setQuery,
  commitSelectedSpeciesAndSave
} from 'src/content/app/new-species-selector/state/species-selector-search-slice/speciesSelectorSearchSlice';
import { setModalView } from 'src/content/app/new-species-selector/state/species-selector-ui-slice/speciesSelectorUISlice';

import ModalView from 'src/shared/components/modal-view/ModalView';
import GenomeSelectorBySearchQuery from 'src/content/app/new-species-selector/components/genome-selector-by-search-query/GenomeSelectorBySearchQuery';
import GenomeSelectorBySpeciesTaxonomyId from 'src/content/app/new-species-selector/components/genome-selector-by-species-taxonomy-id/GenomeSelectorBySpeciesTaxonomyId';

import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

const SpeciesSelectorResultslView = () => {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(setQuery(''));
    dispatch(setModalView(null));
  };

  return (
    <ModalView onClose={onClose}>
      <Content onClose={onClose} />
    </ModalView>
  );
};

const Content = (props: { onClose: () => void }) => {
  const modalView = useAppSelector(getSpeciesSelectorModalView);
  const query = useAppSelector(getSpeciesSearchQuery);
  const selectedPopularSpecies = useAppSelector(getSelectedPopularSpecies);
  const dispatch = useAppDispatch();

  const onSpeciesAdd = (genomes: SpeciesSearchMatch[]) => {
    dispatch(commitSelectedSpeciesAndSave(genomes));
  };

  return modalView === 'species-search' ? (
    <GenomeSelectorBySearchQuery
      query={query}
      onSpeciesAdd={onSpeciesAdd}
      onClose={props.onClose}
    />
  ) : selectedPopularSpecies ? (
    <GenomeSelectorBySpeciesTaxonomyId
      speciesTaxonomyId={selectedPopularSpecies.species_taxonomy_id}
      speciesImageUrl={selectedPopularSpecies.image}
    />
  ) : null; // this last option should never happen
};

export default SpeciesSelectorResultslView;
