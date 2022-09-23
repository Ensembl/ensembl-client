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

import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from 'src/store';
import classNames from 'classnames';

import { BlastFormContextContainer } from './BlastFormContext';

import { useBlastConfigQuery } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import useMediaQuery from 'src/shared/hooks/useMediaQuery';

import { getStep } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
import {
  switchToSequencesStep,
  switchToSpeciesStep
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { setBlastView } from 'src/content/app/tools/blast/state/general/blastGeneralSlice';

import BlastAppBar from 'src/content/app/tools/blast/components/blast-app-bar/BlastAppBar';
import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import { SecondaryButton } from 'src/shared/components/button/Button';

import BlastInputSequencesHeader from 'src/content/app/tools/blast/components/blast-input-sequences/BlastInputSequencesHeader';
import BlastInputSequences from 'src/content/app/tools/blast/components/blast-input-sequences/BlastInputSequences';
import BlastSettings from 'src/content/app/tools/blast/components/blast-settings/BlastSettings';

import BlastSpeciesSelectorHeader from 'src/content/app/tools/blast/components/blast-species-selector/BlastSpeciesSelectorHeader';
import BlastSpeciesSelector from 'src/content/app/tools/blast/components/blast-species-selector/BlastSpeciesSelector';

import styles from './BlastForm.scss';

const BlastForm = () => {
  const { data: config } = useBlastConfigQuery();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setBlastView('blast-form'));
  }, []);

  if (!config) {
    return null;
  }

  return (
    <div className={styles.container}>
      <BlastAppBar />
      <ToolsTopBar>
        <BlastSettings config={config} />
      </ToolsTopBar>
      <Main />
    </div>
  );
};

const Main = () => {
  const isSmallViewport = useMediaQuery('(max-width: 1900px)');

  if (isSmallViewport === null) {
    return null;
  }

  return (
    <BlastFormContextContainer>
      {isSmallViewport ? <MainSmall /> : <MainLarge />}
    </BlastFormContextContainer>
  );
};

const MainLarge = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.grid}>
        <div>
          <BlastInputSequencesHeader compact={false} />
          <BlastInputSequences />
        </div>
        <div className={styles.speciesSelectorContainer}>
          <BlastSpeciesSelectorHeader compact={false} />
          <BlastSpeciesSelector />
        </div>
      </div>
    </div>
  );
};

const MainSmall = () => {
  const step = useAppSelector(getStep);
  const containerRef = useRef<HTMLDivElement>(null);

  const containerClasses = `${styles.mainContainer} ${styles.mainContainerSmall}`;

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  return (
    <div className={containerClasses} ref={containerRef}>
      <BlastFormStepToggle />
      {step === 'sequences' ? (
        <>
          <BlastInputSequencesHeader compact={true} />
          <BlastInputSequences />
        </>
      ) : (
        <>
          <BlastSpeciesSelectorHeader compact={true} />
          <BlastSpeciesSelector />
        </>
      )}
    </div>
  );
};

const BlastFormStepToggle = () => {
  const dispatch = useAppDispatch();
  const step = useAppSelector(getStep);

  const onSwitchToSpecies = () => {
    dispatch(switchToSpeciesStep());
  };

  const onSwitchToSequence = () => {
    dispatch(switchToSequencesStep());
  };

  const sequenceButtonClass = classNames(styles.blastAgainstButton, {
    [styles.buttonActive]: step === 'sequences'
  });
  const speciesButtonClass = classNames(styles.blastAgainstButton, {
    [styles.buttonActive]: step === 'species'
  });

  return (
    <div className={styles.blastFormStepToggle}>
      <SecondaryButton
        className={sequenceButtonClass}
        onClick={onSwitchToSequence}
      >
        Add sequence(s)
      </SecondaryButton>
      <SecondaryButton
        className={speciesButtonClass}
        onClick={onSwitchToSpecies}
      >
        Select species
      </SecondaryButton>
    </div>
  );
};

export default BlastForm;
