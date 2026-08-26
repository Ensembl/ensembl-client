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

import { useNavigate } from 'react-router';

import { useAppSelector, useAppDispatch } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { setSelectedSpecies } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';
import { useVepGenomeSuggestionsQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';

import TextButton from 'src/shared/components/text-button/TextButton';
import SpeciesName from 'src/shared/components/species-name/SpeciesName';
import { CircleLoader } from 'src/shared/components/loader';

import type { VepSelectedSpecies } from 'src/content/app/tools/vep/types/vepSubmission';

import styles from './VepGenomesQuickList.module.css';

const VepGenomesQuickList = () => {
  const storedGenomes = useAppSelector(getEnabledCommittedSpecies);
  const { isFetching, data: popularVepGenomes } =
    useVepGenomeSuggestionsQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onGenomeSelected = (genome: VepSelectedSpecies) => {
    dispatch(setSelectedSpecies({ species: genome }));
    navigate(urlFor.vepForm());
  };

  if (isFetching) {
    return (
      <div className={styles.container}>
        <CircleLoader />
      </div>
    );
  } else if (!popularVepGenomes && !storedGenomes.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
        {popularVepGenomes && (
          <PopularVepGenomes
            genomes={popularVepGenomes}
            onGenomeSelected={onGenomeSelected}
          />
        )}
        {!!storedGenomes.length && (
          <StoredGenomes
            genomes={storedGenomes}
            onGenomeSelected={onGenomeSelected}
          />
        )}
      </div>
    </div>
  );
};

const PopularVepGenomes = ({
  genomes,
  onGenomeSelected
}: {
  genomes: VepSelectedSpecies[];
  onGenomeSelected: (genome: VepSelectedSpecies) => void;
}) => {
  const genomeElements = genomes.map((genome) => (
    <Genome key={genome.genome_id} genome={genome} onClick={onGenomeSelected} />
  ));

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Popular genomes</div>
      <div className={styles.genomes}>{genomeElements}</div>
    </div>
  );
};

const StoredGenomes = ({
  genomes,
  onGenomeSelected
}: {
  genomes: VepSelectedSpecies[];
  onGenomeSelected: (genome: VepSelectedSpecies) => void;
}) => {
  const sortedStroredGenomes = genomes.toSorted((g1, g2) => {
    const name1 = g1.common_name ?? g1.scientific_name;
    const name2 = g2.common_name ?? g2.scientific_name;
    return name1.localeCompare(name2);
  });

  const genomeElements = sortedStroredGenomes.map((genome) => (
    <Genome key={genome.genome_id} genome={genome} onClick={onGenomeSelected} />
  ));

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Genomes from your list</div>
      <div className={styles.genomes}>{genomeElements}</div>
    </div>
  );
};

const Genome = ({
  genome,
  onClick
}: {
  genome: VepSelectedSpecies;
  onClick: (genome: VepSelectedSpecies) => void;
}) => {
  return (
    <TextButton onClick={() => onClick(genome)}>
      <SpeciesName species={genome} />
    </TextButton>
  );
};

export default VepGenomesQuickList;
