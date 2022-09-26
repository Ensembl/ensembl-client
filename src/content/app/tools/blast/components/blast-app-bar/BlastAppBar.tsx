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

import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { AppName } from 'src/global/globalConfig';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { addSelectedSpecies } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { getSelectedSpeciesIds } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
import { placeholderMessage } from 'src/content/app/species-selector/components/species-selector-app-bar/SpeciesSelectorAppBar';
import { getBlastView } from 'src/content/app/tools/blast/state/general/blastGeneralSelectors';

import AppBar from 'src/shared/components/app-bar/AppBar';
import { SpeciesLozenge } from 'src/shared/components/selected-species';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';

import type { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './BlastAppBar.scss';

const BlastAppBar = () => {
  const speciesList = useSelector(getEnabledCommittedSpecies);
  const speciesListIds = useSelector(getSelectedSpeciesIds);
  const blastView = useSelector(getBlastView);

  const dispatch = useDispatch();

  const speciesSelectorLink = useMemo(() => {
    return <Link to={urlFor.speciesSelector()}>Change</Link>;
  }, []);

  if (!speciesList.length) {
    return <AppBar appName={AppName.TOOLS} mainContent={placeholderMessage} />;
  }

  const speciesLozengeClick = (species: CommittedItem) => {
    if (!speciesListIds.includes(species.genome_id)) {
      dispatch(
        addSelectedSpecies({
          genome_id: species.genome_id,
          common_name: species.common_name,
          scientific_name: species.scientific_name,
          assembly_name: species.assembly_name
        })
      );
    }
  };

  const enabledSpecies = speciesList.map((species, index) => (
    <SpeciesLozenge
      key={index}
      theme="blue"
      className={styles.speciesLozenge}
      species={species}
      onClick={() => speciesLozengeClick(species)}
    />
  ));

  const disabledSpecies = speciesList.map((species, index) => (
    <SpeciesLozenge
      key={index}
      theme="grey"
      className={styles.speciesLozenge}
      species={species}
    />
  ));

  const speciesTabs =
    blastView === 'blast-form' ? enabledSpecies : disabledSpecies;

  const wrappedSpecies = (
    <SpeciesTabsWrapper speciesTabs={speciesTabs} link={speciesSelectorLink} />
  );

  return <AppBar appName={AppName.TOOLS} mainContent={wrappedSpecies} />;
};

export default BlastAppBar;
