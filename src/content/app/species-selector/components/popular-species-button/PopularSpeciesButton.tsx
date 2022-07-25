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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import useSpeciesSelectorAnalytics from 'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics';
import useHover from 'src/shared/hooks/useHover';
import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  setSelectedSpecies,
  clearSelectedSearchResult
} from 'src/content/app/species-selector/state/speciesSelectorSlice';
import {
  getCurrentSpeciesGenomeId,
  getCommittedSpecies
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { PopularSpecies } from 'src/content/app/species-selector/types/species-search';

import styles from './PopularSpeciesButton.scss';

export type Props = {
  species: PopularSpecies;
};

const PopularSpeciesButton = (props: Props) => {
  const { species } = props;
  const { genome_id: genomeIdFromProps, is_available: isSpeciesAvailable } =
    species;
  const currentSpeciesGenomeId = useSelector(getCurrentSpeciesGenomeId);
  const allCommittedSpecies = useSelector(getCommittedSpecies);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trackPopularSpeciesSelect } = useSpeciesSelectorAnalytics();
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  // for a species to be 'selected' means that the user has pressed on the popular species button
  // but has not yet confirmed the selection
  const isSpeciesSelected = currentSpeciesGenomeId === genomeIdFromProps;
  const isSpeciesCommitted = allCommittedSpecies.some(
    (species) => species.genome_id === genomeIdFromProps
  );

  const handleClick = () => {
    if (!isSpeciesAvailable) {
      return;
    }

    if (isSpeciesSelected) {
      dispatch(clearSelectedSearchResult());
      trackPopularSpeciesSelect(species, 'unpreselect');
    } else if (isSpeciesCommitted) {
      navigate(
        urlFor.speciesPage({
          genomeId: species.url_slug ?? species.genome_id
        })
      );
    } else {
      // the species is available, not selected and not committed;
      // go ahead and select it
      dispatch(setSelectedSpecies(species));
      trackPopularSpeciesSelect(species, 'preselect');
    }
  };

  const className = classNames(styles.popularSpeciesButton, {
    [styles.popularSpeciesButtonDisabled]: !isSpeciesAvailable,
    [styles.popularSpeciesButtonSelected]: isSpeciesSelected,
    [styles.popularSpeciesButtonCommitted]: isSpeciesCommitted
  });

  const speciesDisplayName = species.common_name || species.scientific_name;

  return (
    <div className={styles.popularSpeciesButtonWrapper}>
      <div className={className} onClick={handleClick} ref={hoverRef}>
        <img src={species.image} />
      </div>
      {isHovered && speciesDisplayName && (
        <Tooltip anchor={hoverRef.current} autoAdjust={true}>
          {speciesDisplayName}
        </Tooltip>
      )}
    </div>
  );
};

export default PopularSpeciesButton;
