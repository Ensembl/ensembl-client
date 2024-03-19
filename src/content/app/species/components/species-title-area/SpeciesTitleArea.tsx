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
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getDisplayName } from 'src/shared/components/selected-species/selectedSpeciesHelpers';

import useSpeciesAnalytics from 'src/content/app/species/hooks/useSpeciesAnalytics';

import { SecondaryButton } from 'src/shared/components/button/Button';
import DeletionConfirmation from 'src/shared/components/deletion-confirmation/DeletionConfirmation';
import SpeciesUsageToggle from './species-usage-toggle/SpeciesUsageToggle';
import InfoPill from 'src/shared/components/info-pill/InfoPill';
import SearchIcon from 'static/icons/icon_search.svg';

import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { useGetPopularSpeciesQuery } from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';
import { useSpeciesDetailsQuery } from 'src/content/app/species/state/api/speciesApiSlice';

import {
  SpeciesSidebarModalView,
  updateSpeciesSidebarModalForGenome
} from 'src/content/app/species/state/sidebar/speciesSidebarSlice';
import { deleteSpeciesAndSave } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import type { RootState } from 'src/store';

import styles from './SpeciesTitleArea.module.css';

const useSpecies = () => {
  const { currentData } = useGetPopularSpeciesQuery();
  const activeGenomeId = useAppSelector(getActiveGenomeId);
  const committedSpecies = useAppSelector((state: RootState) =>
    getCommittedSpeciesById(state, activeGenomeId)
  );
  const { data: speciesDetails } = useSpeciesDetailsQuery(
    activeGenomeId ?? '',
    {
      skip: !activeGenomeId
    }
  );

  if (!currentData) {
    return null;
  }

  const { popular_species } = currentData;

  const iconUrl = popular_species.find(
    (species) =>
      species.species_taxonomy_id == committedSpecies?.species_taxonomy_id // eslint-disable-line eqeqeq
  )?.image;

  return committedSpecies
    ? {
        species: committedSpecies,
        iconUrl,
        assemblyCount: speciesDetails?.number_of_genomes_in_group
      }
    : null;
};

const SpeciesTitleArea = () => {
  const activeGenomeId = useAppSelector(getActiveGenomeId);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { species, iconUrl, assemblyCount } = useSpecies() || {};
  const [isRemoving, setIsRemoving] = useState(false);
  const { trackDeletedSpecies } = useSpeciesAnalytics();

  if (!activeGenomeId) {
    return null;
  }

  const openSearch = () => {
    dispatch(
      updateSpeciesSidebarModalForGenome({
        activeGenomeId,
        fragment: { sidebarModalView: SpeciesSidebarModalView.SEARCH }
      })
    );
  };

  const navigateToAssemblies = () => {
    navigate(
      urlFor.speciesSelectorSearch({
        speciesTaxonomyId: species?.species_taxonomy_id
      })
    );
  };

  const toggleRemovalDialog = () => {
    setIsRemoving(!isRemoving);
  };

  const onRemove = () => {
    dispatch(deleteSpeciesAndSave(activeGenomeId));
    species && trackDeletedSpecies(species);
    navigate(urlFor.speciesSelector());
  };

  const shouldShowAssemblyCount = assemblyCount && assemblyCount > 1;

  return species ? (
    <div className={styles.speciesTitleArea}>
      <div className={styles.grid}>
        {iconUrl && (
          <div className={styles.speciesIcon}>
            <img src={iconUrl} />
          </div>
        )}
        <div className={styles.speciesNameWrapper}>
          <h1 className={styles.speciesName}>{getDisplayName(species)}</h1>
          <span className={styles.assemblyName}>{species.assembly.name}</span>
        </div>
        {shouldShowAssemblyCount && (
          <button
            className={styles.assemblyCountWrapper}
            onClick={navigateToAssemblies}
          >
            <InfoPill>{assemblyCount}</InfoPill>
            <span className={styles.assembliesLink}>Assemblies</span>
          </button>
        )}
        <div className={styles.speciesToggle}>
          <SpeciesUsageToggle />
        </div>
        <div className={styles.geneSearchWrapper} onClick={openSearch}>
          <span>Find a gene</span>
          <SearchIcon />
        </div>
        <div className={styles.speciesRemove}>
          <SecondaryButton
            onClick={toggleRemovalDialog}
            disabled={isRemoving}
            className={classNames({
              [styles.disabledRemoveButton]: isRemoving
            })}
          >
            Remove species
          </SecondaryButton>
        </div>
        {isRemoving && (
          <DeletionConfirmation
            warningText="If you remove this species, any views you have configured will be lost — do you wish to continue?"
            confirmText="Remove"
            cancelText="Do not remove"
            className={styles.speciesRemoveMessage}
            onCancel={toggleRemovalDialog}
            onConfirm={onRemove}
          />
        )}
      </div>
    </div>
  ) : (
    <div className={styles.speciesTitleAreaEmpty} />
  );
};

export default SpeciesTitleArea;
