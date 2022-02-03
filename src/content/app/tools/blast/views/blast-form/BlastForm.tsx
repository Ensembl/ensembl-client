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

import SpeciesSelectorHeader from 'src/content/app/tools/blast/components/species-selector/SpeciesSelectorHeader';
import SpeciesSelector from 'src/content/app/tools/blast/components/species-selector/SpeciesSelector';

import styles from './BlastForm.scss';

//TODO: hardcoding species list for now, this need replacing with API when we implement search or add more species and find out which field we need to submit a job
const speciesList = [
  {
    assembly_name: 'GRCh38.p13',
    common_name: 'Human',
    genome_id: 'homo_sapiens_GCA_000001405_28',
    scientific_name: 'Homo sapiens'
  },
  {
    assembly_name: 'IWGSC',
    common_name: null,
    genome_id: 'triticum_aestivum_GCA_900519105_1',
    scientific_name: 'Triticum aestivum'
  },
  {
    assembly_name: 'GRCh37.p13',
    common_name: 'Human',
    genome_id: 'homo_sapiens_GCA_000001405_14',
    scientific_name: 'Homo sapiens'
  },
  {
    assembly_name: 'WBcel235',
    common_name: null,
    genome_id: 'caenorhabditis_elegans_GCA_000002985_3',
    scientific_name: 'Caenorhabditis elegans'
  },
  {
    assembly_name: 'R64-1-1',
    common_name: null,
    genome_id: 'saccharomyces_cerevisiae_GCA_000146045_2',
    scientific_name: 'Saccharomyces cerevisiae'
  },
  {
    assembly_name: 'ASM584v2',
    common_name: null,
    genome_id:
      'escherichia_coli_str_k_12_substr_mg1655_gca_000005845_GCA_000005845_2',
    scientific_name: 'Escherichia coli str. K-12 substr. MG1655'
  },
  {
    assembly_name: 'ASM276v2',
    common_name: null,
    genome_id: 'plasmodium_falciparum_GCA_000002765_2',
    scientific_name: 'Plasmodium falciparum 3D7'
  }
];

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
        <div>
          <SpeciesSelectorHeader compact={false} />
          <SpeciesSelector speciesList={speciesList} />
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
          <SpeciesSelectorHeader compact={true} />
          <SpeciesSelector speciesList={speciesList} />
        </>
      )}
    </div>
  );
};

export default BlastForm;
