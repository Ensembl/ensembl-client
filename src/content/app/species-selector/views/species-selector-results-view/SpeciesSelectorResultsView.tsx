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

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'src/store';
import useSpeciesSelectorAnalytics from 'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { commitSelectedSpeciesAndSave } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import * as urlFor from 'src/shared/helpers/urlHelper';

import ModalView from 'src/shared/components/modal-view/ModalView';
import GenomeSelectorBySearchQuery from 'src/content/app/species-selector/components/genome-selector-by-search-query/GenomeSelectorBySearchQuery';
import GenomeSelectorBySpeciesTaxonomyId from 'src/content/app/species-selector/components/genome-selector-by-species-taxonomy-id/GenomeSelectorBySpeciesTaxonomyId';

import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';

const SpeciesSelectorResultslView = () => {
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  return (
    <ModalView onClose={onClose}>
      <Content onClose={onClose} />
    </ModalView>
  );
};

const Content = (props: { onClose: () => void }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const committedSpecies = useAppSelector(getCommittedSpecies);

  const dispatch = useAppDispatch();
  const { trackAddedGenome, trackTotalSelectedGenomesCount } =
    useSpeciesSelectorAnalytics();

  useEffect(() => {
    if (
      !searchParams.get('query') &&
      !searchParams.get('species_taxonomy_id')
    ) {
      navigate(urlFor.speciesSelector());
    }
  });

  const onSpeciesAdd = (genomes: SpeciesSearchMatch[]) => {
    dispatch(commitSelectedSpeciesAndSave(genomes));

    // track which genomes were added and how many selected genomes user has as a result
    const totalGenomesCount = committedSpecies.length + genomes.length;
    trackTotalSelectedGenomesCount(totalGenomesCount);

    for (const addedGenome of genomes) {
      trackAddedGenome(addedGenome);
    }

    navigate(-1);
  };

  return searchParams.has('query') ? (
    <GenomeSelectorBySearchQuery
      onSpeciesAdd={onSpeciesAdd}
      onClose={props.onClose}
    />
  ) : searchParams.has('species_taxonomy_id') ? (
    <GenomeSelectorBySpeciesTaxonomyId
      onSpeciesAdd={onSpeciesAdd}
      speciesTaxonomyId={searchParams.get('species_taxonomy_id') as string}
    />
  ) : null; // this last option should never happen
};

export default SpeciesSelectorResultslView;
