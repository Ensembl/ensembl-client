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

import classNames from 'classnames';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getSelectedSpecies } from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';
import { clearSelectedSpecies } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import { VepSpeciesName } from 'src/content/app/tools/vep/components/vep-species-name/VepSpeciesName';
import PlusButton from 'src/shared/components/plus-button/PlusButton';
import TextButton from 'src/shared/components/text-button/TextButton';

import styles from './VepFormSpeciesSection.module.css';

export const VepFormSpecies = (props: {
  className?: string;
  onOpenSpeciesSelector: () => void;
}) => {
  const selectedSpecies = useAppSelector(getSelectedSpecies);

  if (!selectedSpecies) {
    return (
      <TextButton onClick={props.onOpenSpeciesSelector}>
        Select a genome
      </TextButton>
    );
  }

  return (
    <div className={props.className}>
      <VepSpeciesName selectedSpecies={selectedSpecies} />
    </div>
  );
};

export const VepSpeciesSelectorNavButton = (props: {
  className?: string;
  onOpenSpeciesSelector: () => void;
}) => {
  const selectedSpecies = useAppSelector(getSelectedSpecies);
  const dispatch = useAppDispatch();

  const onClear = () => {
    dispatch(clearSelectedSpecies());
  };

  if (!selectedSpecies) {
    return (
      <div className={props.className}>
        <PlusButton onClick={props.onOpenSpeciesSelector} />
      </div>
    );
  }

  return (
    <div className={classNames(props.className, styles.speciesToggle)}>
      <TextButton onClick={props.onOpenSpeciesSelector}>Change</TextButton>
      <TextButton onClick={onClear}>Clear</TextButton>
    </div>
  );
};
