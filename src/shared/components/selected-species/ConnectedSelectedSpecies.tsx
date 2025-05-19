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

import { useAppSelector } from 'src/store';

import { getAssembliesWithMultipleCommittedGenomes } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import SelectedSpecies from 'src/shared/components/selected-species/SelectedSpecies';

import type { Props as SelectedSpeciesProps } from './SelectedSpecies';

type Props = Omit<SelectedSpeciesProps, 'withReleaseInfo'>;

/**
 * The purpose of this component is to be a wrapper around the SelectedSpecies component,
 * and to inject some data retrieved from redux into it.
 */

const ConnectedSelectedSpecies = (props: Props) => {
  const { species } = props;
  const assembliesWithMultipleGenomes = useAppSelector(
    getAssembliesWithMultipleCommittedGenomes
  );

  const shouldShowReleaseInfo = assembliesWithMultipleGenomes.has(
    species.assembly.accession_id
  );

  return <SelectedSpecies withReleaseInfo={shouldShowReleaseInfo} {...props} />;
};

export default ConnectedSelectedSpecies;
