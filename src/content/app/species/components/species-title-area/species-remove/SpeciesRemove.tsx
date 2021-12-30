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

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';
import useSpeciesAnalytics from 'src/content/app/species/hooks/useSpeciesAnalytics';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { deleteSpeciesAndSave } from 'src/content/app/species-selector/state/speciesSelectorSlice';

import { PrimaryButton } from 'src/shared/components/button/Button';

import { RootState } from 'src/store';

import styles from './SpeciesRemove.scss';

const SpeciesRemove = () => {
  const [isRemoving, setIsRemoving] = useState(false);
  const genomeId = useSelector(getActiveGenomeId);
  const species = useSelector((state: RootState) =>
    getCommittedSpeciesById(state, genomeId || '')
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { trackDeletedSpecies } = useSpeciesAnalytics();

  if (!genomeId || !species) {
    return null;
  }

  const toggleRemovalDialog = () => {
    setIsRemoving(!isRemoving);
  };

  const onRemove = () => {
    dispatch(deleteSpeciesAndSave(genomeId));
    trackDeletedSpecies(species);
    navigate(urlFor.speciesSelector());
  };

  return (
    <div>
      {isRemoving ? (
        <div className={styles.speciesRemovalConfirmation}>
          <span className={styles.speciesRemovalWarning}>
            {confirmationMessage}
          </span>
          <div className={styles.speciesRemovalConfirmationControls}>
            <PrimaryButton onClick={onRemove}>Remove</PrimaryButton>
            <span className={styles.clickable} onClick={toggleRemovalDialog}>
              Do not remove
            </span>
          </div>
        </div>
      ) : (
        <span className={styles.clickable} onClick={toggleRemovalDialog}>
          Remove
        </span>
      )}
    </div>
  );
};

export const confirmationMessage =
  'If you remove this species, any views you have configured will be lost — do you wish to continue?';

export default SpeciesRemove;
