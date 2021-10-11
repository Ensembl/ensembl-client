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
import classNames from 'classnames';
import { push } from 'connected-react-router';

import useSpeciesSelectorAnalytics from 'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics';
import useHover from 'src/shared/hooks/useHover';
import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  handleSelectedSpecies,
  clearSelectedSearchResult
} from 'src/content/app/species-selector/state/speciesSelectorActions';
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

// type Props = {
//   species: PopularSpecies;
//   isSelected: boolean;
//   isCommitted: boolean;
//   handleSelectedSpecies: (species: PopularSpecies) => void;
//   clearSelectedSpecies: () => void;
//   push: (url: string) => void;
// };

const PopularSpeciesButton = (props: Props) => {
  const { species } = props;
  const { genome_id: genomeIdFromProps, is_available: isSpeciesAvailable } =
    species;
  const currentSpeciesGenomeId = useSelector(getCurrentSpeciesGenomeId);
  const allCommittedSpecies = useSelector(getCommittedSpecies);
  const dispatch = useDispatch();
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
      dispatch(
        push(
          urlFor.speciesPage({
            genomeId: species.genome_id
          })
        )
      );
    } else {
      // the species is available, not selected and not committed;
      // go ahead and select it
      dispatch(handleSelectedSpecies(species));
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

// named export is for testing purposes
// use default export for development
// export const PopularSpeciesButton = (props: Props) => {
//   const { isSelected, isCommitted, species } = props;
//   const [hoverRef, isHovered] = useHover<HTMLDivElement>();

//   const { trackPopularSpeciesSelect } = useSpeciesSelectorAnalytics();

//   const handleClick = () => {
//     const { is_available } = species;

//     if (!is_available) {
//       return;
//     }

//     if (isSelected) {
//       props.clearSelectedSpecies();
//       trackPopularSpeciesSelect(species, 'unpreselect');
//     } else if (isCommitted) {
//       props.push(
//         urlFor.speciesPage({
//           genomeId: species.genome_id
//         })
//       );
//     } else {
//       // the species is available, not selected and not committed;
//       // go ahead and select it
//       props.handleSelectedSpecies(species);
//       trackPopularSpeciesSelect(species, 'preselect');
//     }
//   };

//   const className = classNames(styles.popularSpeciesButton, {
//     [styles.popularSpeciesButtonDisabled]: !species.is_available,
//     [styles.popularSpeciesButtonSelected]: isSelected,
//     [styles.popularSpeciesButtonCommitted]: isCommitted
//   });

//   const speciesDisplayName = species.common_name || species.scientific_name;

//   return (
//     <div className={styles.popularSpeciesButtonWrapper}>
//       <div className={className} onClick={handleClick} ref={hoverRef}>
//         <img src={species.image} />
//       </div>
//       {isHovered && speciesDisplayName && (
//         <Tooltip anchor={hoverRef.current} autoAdjust={true}>
//           {speciesDisplayName}
//         </Tooltip>
//       )}
//     </div>
//   );
// };

export default PopularSpeciesButton;
