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

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import {
  toggleSpeciesUseAndSave,
  deleteSpeciesAndSave
} from 'src/content/app/species-selector/state/speciesSelectorActions';

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';
import { PrimaryButton } from 'src/shared/components/button/Button';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import { RootState } from 'src/store';

import styles from './SpeciesSelectionControls.scss';

type SpeciesUseToggle = {
  isUsed: boolean;
  onChange: (isUsed: boolean) => void;
};

type LabelProps = {
  className?: string;
  onClick?: () => void;
};

type SpeciesRemovalConfirmationProps = {
  onConfirm: () => void;
  onReject: () => void;
};

const SpeciesSelectionControls = () => {
  const [isRemoving, setIsRemoving] = useState(false);
  const genomeId = useSelector(getActiveGenomeId);
  const species = useSelector((state: RootState) =>
    getCommittedSpeciesById(state, genomeId || '')
  );
  const dispatch = useDispatch();

  if (!genomeId || !species) {
    return null;
  }

  const onToggleUse = () => {
    dispatch(toggleSpeciesUseAndSave(genomeId));
  };

  const toggleRemovalDialog = () => {
    setIsRemoving(!isRemoving);
  };

  const onRemove = () => {
    dispatch(push(urlFor.speciesSelector()));
    dispatch(deleteSpeciesAndSave(genomeId));
  };

  const removeLabelStyles = classNames(styles.remove, styles.clickable);

  return (
    <div className={styles.speciesSelectionControls}>
      <SpeciesUseToggle isUsed={species.isEnabled} onChange={onToggleUse} />
      <div className={styles.removalContainer}>
        {isRemoving ? (
          <SpeciesRemovalConfirmation
            onConfirm={onRemove}
            onReject={toggleRemovalDialog}
          />
        ) : (
          <span className={removeLabelStyles} onClick={toggleRemovalDialog}>
            Remove
          </span>
        )}
      </div>
    </div>
  );
};

const speciesUseToggleHelpMessage = `When 'Use' is selected, this species will appear in the species list in all apps.
'Don't use' will disable this species in other apps, but will not remove it from your list in Species selector.`;

const SpeciesUseToggle = (props: SpeciesUseToggle) => {
  const doNotUseLabelProps: LabelProps = {};
  const useLabelProps: LabelProps = {};

  if (props.isUsed) {
    doNotUseLabelProps.className = styles.clickable;
    doNotUseLabelProps.onClick = () => props.onChange(!props.isUsed);
  } else {
    useLabelProps.className = styles.clickable;
    useLabelProps.onClick = () => props.onChange(!props.isUsed);
  }

  return (
    <div className={styles.speciesUseToggle}>
      <span {...doNotUseLabelProps}>Don't use</span>
      <SlideToggle
        className={styles.toggle}
        isOn={props.isUsed}
        onChange={props.onChange}
      />
      <span {...useLabelProps}>Use</span>
      <QuestionButton helpText={speciesUseToggleHelpMessage} />
    </div>
  );
};

export const speciesRemovalConfirmationMessage =
  'If you remove this species, any views you have configured will be lost — do you wish to continue?';

const SpeciesRemovalConfirmation = (props: SpeciesRemovalConfirmationProps) => {
  return (
    <div className={styles.speciesRemovalConfirmation}>
      <span className={styles.speciesRemovalWarning}>
        {speciesRemovalConfirmationMessage}
      </span>
      <PrimaryButton onClick={props.onConfirm}>Remove</PrimaryButton>
      <span className={styles.clickable} onClick={props.onReject}>
        Do not remove
      </span>
    </div>
  );
};

export default SpeciesSelectionControls;
