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
import { useSelector } from 'react-redux';

import useMediaQuery from 'src/shared/hooks/useMediaQuery';

import { getStep } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import ToolsAppBar from 'src/content/app/tools/shared/components/tools-app-bar/ToolsAppBar';
import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';

import BlastInputSequencesHeader from 'src/content/app/tools/blast/components/blast-input-sequences/BlastInputSequencesHeader';
import BlastInputSequences from 'src/content/app/tools/blast/components/blast-input-sequences/BlastInputSequences';

import BlastSpeciesSelectorHeader from 'src/content/app/tools/blast/components/blast-species-selector/BlastSpeciesSelectorHeader';
import BlastSpeciesSelector from 'src/content/app/tools/blast/components/blast-species-selector/BlastSpeciesSelector';

import styles from './BlastForm.scss';

const BlastForm = () => {
  return (
    <div className={styles.container}>
      <ToolsAppBar />
      <ToolsTopBar>Various toggles go here</ToolsTopBar>
      <Main />
    </div>
  );
};

const Main = () => {
  const isSmallViewport = useMediaQuery('(max-width: 1900px)');

  if (isSmallViewport === null) {
    return null;
  }

  return isSmallViewport ? <MainSmall /> : <MainLarge />;
};

const MainLarge = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.grid}>
        <div>
          <BlastInputSequencesHeader compact={false} />
          <BlastInputSequences />
        </div>
        <div className={styles.speciesSelectorGrid}>
          <BlastSpeciesSelectorHeader compact={false} />
          <BlastSpeciesSelector />
        </div>
      </div>
    </div>
  );
};

const MainSmall = () => {
  const step = useSelector(getStep);

  return (
    <div className={styles.mainContainer}>
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

export default BlastForm;
