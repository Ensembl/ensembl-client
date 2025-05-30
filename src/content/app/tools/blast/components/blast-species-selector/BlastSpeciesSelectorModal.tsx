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

import { useAppDispatch, useAppSelector } from 'src/store';

import { getSelectedSpeciesList } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import {
  addSelectedSpecies,
  closeSpeciesSearchModal
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import ModalView from 'src/shared/components/modal-view/ModalView';
import BlastSpeciesSelector from 'src/content/app/tools/blast/components/blast-species-selector/BlastSpeciesSelector';

import { BLAST_MAX_SPECIES_COUNT } from 'src/content/app/tools/blast/constants/blastFormConstants';

import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';

const BlastSpeciesSelectorModal = () => {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeSpeciesSearchModal());
  };

  return (
    <ModalView onClose={onClose}>
      <Content onClose={onClose} />
    </ModalView>
  );
};

const Content = (props: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const selectedSpecies = useAppSelector(getSelectedSpeciesList); // list of species already selected for BLAST search

  const onSpeciesAdd = (genomes: SpeciesSearchMatch[]) => {
    const preparedGenomes = genomes.map((genome) => ({
      ...genome,
      isEnabled: true,
      selectedAt: Date.now()
    }));
    dispatch(addSelectedSpecies(preparedGenomes));
    props.onClose();
  };

  return (
    <BlastSpeciesSelector
      maxSelectableGenomesCount={BLAST_MAX_SPECIES_COUNT}
      selectedSpecies={selectedSpecies}
      onSpeciesAdd={onSpeciesAdd}
      onClose={props.onClose}
    />
  );
};

export default BlastSpeciesSelectorModal;
