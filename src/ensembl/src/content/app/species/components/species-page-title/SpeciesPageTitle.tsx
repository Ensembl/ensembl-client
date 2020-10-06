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
import { useSelector, useDispatch } from 'react-redux';

import { getDisplayName } from 'src/shared/components/new-selected-species/selectedSpeciesHelpers';

import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getPopularSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { fetchPopularSpecies } from 'src/content/app/species-selector/state/speciesSelectorActions';

import InlineSVG from 'src/shared/components/inline-svg/InlineSvg';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import { RootState } from 'src/store';

import styles from './SpeciesPageTitle.scss';

type DisplayProps = {
  species: CommittedItem;
  iconUrl: string; // should be url of an svg
};

/**
 * TODO: this component will need updating when we get an api endpoint
 * that can include url of species icon in its response. The current use of
 * the popular species endpoint for this purpose is hopefully temporary.
 */

const SpeciesPageTitle = () => {
  const activeGenomeId = useSelector(getActiveGenomeId) || '';
  const popularSpecies = useSelector(getPopularSpecies);
  const committedSpecies = useSelector((state: RootState) =>
    getCommittedSpeciesById(state, activeGenomeId)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!popularSpecies.length) {
      dispatch(fetchPopularSpecies());
    }
  }, []);

  const iconUrl = popularSpecies.find(
    (species) => species.genome_id === activeGenomeId
  )?.image;

  return committedSpecies && iconUrl ? (
    <SpeciesPageTitleDisplay species={committedSpecies} iconUrl={iconUrl} />
  ) : null;
};

const SpeciesPageTitleDisplay = (props: DisplayProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.speciesIcon}>
        <InlineSVG src={props.iconUrl} />
      </div>
      <div className={styles.speciesLabel}>
        <h1 className={styles.speciesName}>{getDisplayName(props.species)}</h1>
        <span className={styles.assemblyName}>
          {props.species.assembly_name}
        </span>
      </div>
    </div>
  );
};

export default SpeciesPageTitle;
