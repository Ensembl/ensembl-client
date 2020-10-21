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

import React, { ReactElement } from 'react';

import { nonBreakingSpace } from 'src/shared/constants/strings';

import styles from './MultiLineSpeciesWrapper.scss';

import { Props as SelectedSpeciesProps } from 'src/shared/components/selected-species/SelectedSpecies';
import { Props as SpeciesSelectorSelectedSpeciesProps } from 'src/content/app/species-selector/components/selected-species/SelectedSpecies';

type MultiLineSelectedSpeciesProps =
  | SelectedSpeciesProps
  | SpeciesSelectorSelectedSpeciesProps;

export type Props = {
  isWrappable: true;
  speciesTabs: ReactElement<MultiLineSelectedSpeciesProps>[];
  link?: React.ReactNode;
};

const MultiLineWrapper = (props: Props) => {
  return (
    <div>
      {props.speciesTabs}
      {nonBreakingSpace}
      {props.link && <div className={styles.linkWrapper}>{props.link}</div>}
    </div>
  );
};

export default MultiLineWrapper;
