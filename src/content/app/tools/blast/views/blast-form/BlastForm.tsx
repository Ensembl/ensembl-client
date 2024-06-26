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

import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from 'src/store';
import classNames from 'classnames';

import { BlastFormContextContainer } from './BlastFormContext';

import { useBlastConfigQuery } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';

import useMediaQuery from 'src/shared/hooks/useMediaQuery';
import { smallViewportMediaQuery } from './blastFormConstants';

import {
  getStep,
  getModalView
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
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
import BlastSpeciesSelectorModal from 'src/content/app/tools/blast/components/blast-species-selector/BlastSpeciesSelectorModal';
import BlastSelectedSpeciesListHeader from 'src/content/app/tools/blast/components/blast-selected-species-list/BlastSelectedSpeciesListHeader';
import BlastSelectedSpeciesList from 'src/content/app/tools/blast/components/blast-selected-species-list/BlastSelectedSpeciesList';

import styles from './BlastForm.module.css';

const BlastForm = () => {
  const { data: config } = useBlastConfigQuery();

  const modalView = useAppSelector(getModalView);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setBlastView('blast-form'));
  }, []);

  useEffect(() => {
    dispatch(setBlastView('blast-form'));
  }, [modalView]);

  if (!config) {
    return null;
  } else if (modalView) {
    return (
      <div className={styles.containerWithModal}>
        <BlastAppBar />
        <BlastSpeciesSelectorModal />
      </div>
    );
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
  const isSmallViewport = useMediaQuery(smallViewportMediaQuery);

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
          <BlastSelectedSpeciesListHeader compact={false} />
          <BlastSelectedSpeciesList />
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
          <BlastSelectedSpeciesListHeader compact={true} />
          <BlastSelectedSpeciesList />
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
