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

import { getSelectedSpecies } from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';
import { updateSpeciesSelectorModalOpenFlag } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import { VepSpeciesName } from 'src/content/app/tools/vep/components/vep-species-name/VepSpeciesName';
import PlusButton from 'src/shared/components/plus-button/PlusButton';
import TextButton from 'src/shared/components/text-button/TextButton';

export const VepFormSpecies = () => {
  const dispatch = useAppDispatch();
  const selectedSpecies = useAppSelector(getSelectedSpecies);

  const openSpeciesSelectorModal = () => {
    dispatch(updateSpeciesSelectorModalOpenFlag(true));
  };

  if (!selectedSpecies) {
    return (
      <TextButton onClick={openSpeciesSelectorModal}>
        Select a species / assembly
      </TextButton>
    );
  }

  return <VepSpeciesName selectedSpecies={selectedSpecies} />;
};

export const VepSpeciesSelectorNavButton = () => {
  const dispatch = useAppDispatch();
  const selectedSpecies = useAppSelector(getSelectedSpecies);

  const openSpeciesSelector = () => {
    dispatch(updateSpeciesSelectorModalOpenFlag(true));
  };

  if (!selectedSpecies) {
    return <PlusButton onClick={openSpeciesSelector} />;
  } else {
    return <TextButton onClick={openSpeciesSelector}>Change</TextButton>;
  }
};
