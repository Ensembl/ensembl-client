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

import { Link } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppSelector } from 'src/store';

import { getSelectedSpecies } from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import { VepSpeciesName } from 'src/content/app/tools/vep/components/vep-species-name/VepSpeciesName';
import PlusButton from 'src/shared/components/plus-button/PlusButton';
import TextButton from 'src/shared/components/text-button/TextButton';

const vepSpeciesSelectorUrl = urlFor.vepSpeciesSelector();

export const VepFormSpecies = (props: { className?: string }) => {
  const selectedSpecies = useAppSelector(getSelectedSpecies);

  if (!selectedSpecies) {
    return <Link to={vepSpeciesSelectorUrl}>Select a species / assembly</Link>;
  }

  return (
    <div className={props.className}>
      <VepSpeciesName selectedSpecies={selectedSpecies} />
    </div>
  );
};

export const VepSpeciesSelectorNavButton = (props: { className?: string }) => {
  const selectedSpecies = useAppSelector(getSelectedSpecies);

  return (
    <Link to={vepSpeciesSelectorUrl} className={props.className}>
      {!selectedSpecies ? <PlusButton /> : <TextButton>Change</TextButton>}
    </Link>
  );
};
