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
import classNames from 'classnames';

import { getDisplayName } from './selectedSpeciesHelpers';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './selected-species-common.scss';

type Props = {
  species: CommittedItem;
  classNames?: {
    name?: string;
    assembly?: string;
  };
};

const SelectedSpeciesContent = (props: Props) => {
  const displayName = getDisplayName(props.species);

  const nameClasses = classNames(
    styles.name,
    props.classNames && props.classNames.name
  );

  const assemblyClasses = classNames(
    styles.assembly,
    props.classNames && props.classNames.assembly
  );

  return (
    <>
      <span className={nameClasses}>{displayName}</span>
      <span className={assemblyClasses}>{props.species.assembly_name}</span>
    </>
  );
};

export default SelectedSpeciesContent;
