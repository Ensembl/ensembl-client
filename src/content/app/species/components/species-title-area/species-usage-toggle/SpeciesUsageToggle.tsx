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

import { useAppSelector, useAppDispatch } from 'src/store';
import useSpeciesAnalytics from 'src/content/app/species/hooks/useSpeciesAnalytics';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { toggleSpeciesUseAndSave } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import { RootState } from 'src/store';

import styles from './SpeciesUsageToggle.scss';

type LabelProps = {
  className?: string;
  onClick?: () => void;
};

const SpeciesUsageToggle = () => {
  const genomeId = useAppSelector(getActiveGenomeId);
  const species = useAppSelector((state: RootState) =>
    getCommittedSpeciesById(state, genomeId || '')
  );
  const dispatch = useAppDispatch();

  const { trackSpeciesUse } = useSpeciesAnalytics();

  if (!genomeId || !species) {
    return null;
  }

  const onToggleUse = () => {
    trackSpeciesUse(species);
    dispatch(toggleSpeciesUseAndSave(genomeId));
  };

  const doNotUseLabelProps: LabelProps = {};
  const useLabelProps: LabelProps = {};

  if (species.isEnabled) {
    doNotUseLabelProps.className = styles.clickable;
    doNotUseLabelProps.onClick = onToggleUse;
  } else {
    useLabelProps.className = styles.clickable;
    useLabelProps.onClick = onToggleUse;
  }

  return (
    <div className={styles.speciesUsageToggle}>
      <span {...doNotUseLabelProps}>Don't use</span>
      <SlideToggle
        className={styles.toggle}
        isOn={species.isEnabled}
        onChange={onToggleUse}
      />
      <span {...useLabelProps}>Use</span>
      <QuestionButton helpText={helpMessage} />
    </div>
  );
};

const helpMessage = `When 'Use' is selected, this species will appear in the species list in all apps.
'Don't use' will disable this species in other apps, but will not remove it from your list in Species selector.`;

export default SpeciesUsageToggle;
