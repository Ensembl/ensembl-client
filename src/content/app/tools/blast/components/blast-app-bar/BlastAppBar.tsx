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
import { Link } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppSelector, useAppDispatch } from 'src/store';
import useMediaQuery from 'src/shared/hooks/useMediaQuery';

import { smallViewportMediaQuery } from 'src/content/app/tools/blast/views/blast-form/blastFormConstants';

import {
  getStep as getBlastFormStep,
  getModalView
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { addSelectedSpecies } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { getSelectedSpeciesIds } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
import { placeholderMessage } from 'src/content/app/species-selector/components/species-selector-app-bar/SpeciesSelectorAppBar';
import { getBlastView } from 'src/content/app/tools/blast/state/general/blastGeneralSelectors';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { SpeciesLozenge } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';
import { HelpPopupButton } from 'src/shared/components/help-popup';

import { AppName as AppNameText } from 'src/global/globalConfig';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

const BlastAppBar = () => {
  const speciesList = useAppSelector(getEnabledCommittedSpecies);
  const speciesListIds = useAppSelector(getSelectedSpeciesIds);
  const blastView = useAppSelector(getBlastView);
  const modalView = useAppSelector(getModalView);
  const blastFormStep = useAppSelector(getBlastFormStep);

  const dispatch = useAppDispatch();

  const isSmallViewport = useMediaQuery(smallViewportMediaQuery);

  const appBarProps = {
    topLeft: <AppName>{AppNameText.TOOLS}</AppName>,
    aside: <HelpPopupButton slug="blast" />
  };

  if (!speciesList.length) {
    return <AppBar mainContent={placeholderMessage} {...appBarProps} />;
  }

  const speciesLozengeClick = (species: CommittedItem) => {
    if (!speciesListIds.includes(species.genome_id)) {
      dispatch(
        addSelectedSpecies({
          genome_id: species.genome_id,
          genome_tag: species.genome_tag,
          common_name: species.common_name,
          scientific_name: species.scientific_name,
          species_taxonomy_id: species.species_taxonomy_id,
          assembly: {
            accession_id: species.assembly.name,
            name: species.assembly.name
          },
          is_reference: species.is_reference,
          type: species.type,
          isEnabled: true
        })
      );
    }
  };

  const areSpeciesEnabled = shouldEnableSpecies({
    blastView,
    blastFormStep,
    modalView,
    isSmallViewport
  });

  const speciesTabs = areSpeciesEnabled
    ? speciesList.map((species, index) => (
        <SpeciesLozenge
          key={index}
          theme="blue"
          species={species}
          onClick={() => speciesLozengeClick(species)}
        />
      ))
    : speciesList.map((species, index) => (
        <SpeciesLozenge key={index} theme="grey" species={species} />
      ));

  const speciesTabsSlider = (
    <SpeciesTabsWrapper>
      <SpeciesTabsSlider>{speciesTabs}</SpeciesTabsSlider>
      <Link to={urlFor.speciesSelector()}>Change</Link>
    </SpeciesTabsWrapper>
  );

  return (
    <AppBar
      mainContent={speciesTabsSlider}
      topRight={<SpeciesManagerIndicator />}
      {...appBarProps}
    />
  );
};

const shouldEnableSpecies = (params: {
  blastView: string;
  blastFormStep: string;
  modalView: string | null;
  isSmallViewport: boolean | null;
}) => {
  const { blastView, blastFormStep, modalView, isSmallViewport } = params;

  if (modalView) {
    return false;
  }

  return (
    (blastView === 'blast-form' && !isSmallViewport) ||
    (blastView === 'blast-form' &&
      isSmallViewport &&
      blastFormStep === 'species')
  );
};

export default BlastAppBar;
