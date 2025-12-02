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

import { type ChangeEvent } from 'react';
import classNames from 'classnames';

import useTopBarState from './useTopBarState';

// import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';

import FlatInput from 'src/shared/components/input/FlatInput';

import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';
import type { GenomeGroupForStructuralVariants } from 'src/content/app/structural-variants/types/genomeGroup';

import styles from './StructuralVariantsTopBar.module.css';

const StructuralVariantsTopBar = () => {
  const {
    genomeGroups,
    genomesInGroup,
    exampleLocation,
    referenceGenome,
    altGenome,
    changeReferenceGenome,
    changeAltGenome
  } = useTopBarState();

  const onGenomeGroupSelected = (event: ChangeEvent<HTMLSelectElement>) => {
    const groupId = event.currentTarget.value;
    const genomeGroup = genomeGroups!.find((group) => group.id === groupId);

    if (genomeGroup) {
      // this should not happen
      const referenceGenome = genomeGroup.reference_genome;
      changeReferenceGenome(referenceGenome);
    }
  };

  const onAlternativeGenomeSelected = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const genomeId = event.currentTarget.value;
    const genome = genomesInGroup!.find(
      (genome) => genome.genome_id === genomeId
    );

    if (genome) {
      changeAltGenome(genome);
    }
  };

  const getReferenceGenomeGroupId = () => {
    if (referenceGenome) {
      const group = genomeGroups!.find(
        (group) =>
          group.reference_genome.genome_id === referenceGenome.genome_id
      );
      return group?.id;
    }
  };

  // const formattedLocation = exampleLocation ? getFormattedLocation(exampleLocation)

  // const x = referenceGenome;

  return (
    <div className={styles.topBar}>
      <span className={classNames(styles.withRightMargin, styles.light)}>
        Show
      </span>

      <span className={styles.withRightMargin}>Structural variation</span>

      <span className={classNames(styles.withRightMargin, styles.light)}>
        between
      </span>

      <SimpleSelect
        className={styles.select}
        options={getGenomeGroupsOptions(genomeGroups ?? [])}
        placeholder="Select"
        value={getReferenceGenomeGroupId() ?? ''}
        onChange={onGenomeGroupSelected}
      />

      <span className={classNames(styles.withBothMargins, styles.light)}>
        in region
      </span>

      <FlatInput defaultValue={exampleLocation ?? ''} />

      <span className={classNames(styles.withBothMargins, styles.light)}>
        and
      </span>

      <SimpleSelect
        className={styles.select}
        options={getAltGenomeOptions({
          genomes: genomesInGroup ?? [],
          referenceGenome: referenceGenome as BriefGenomeSummary
        })}
        placeholder="Select"
        disabled={!genomesInGroup}
        value={altGenome?.genome_id ?? ''}
        onChange={onAlternativeGenomeSelected}
      />
    </div>
  );
};

const getGenomeGroupsOptions = (groups: GenomeGroupForStructuralVariants[]) => {
  return groups.map((group) => ({
    value: group.id,
    label: createGenomeLabel(group.reference_genome)
  }));
};

const getAltGenomeOptions = ({
  genomes,
  referenceGenome
}: {
  genomes: BriefGenomeSummary[];
  referenceGenome: BriefGenomeSummary;
}) => {
  return genomes
    .filter((genome) => genome.genome_id !== referenceGenome.genome_id)
    .map((genome) => ({
      value: genome.genome_id,
      label: createGenomeLabel(genome)
    }));
};

// TODO: extract this into a shared helper / formatter function?
const createGenomeLabel = (genome: BriefGenomeSummary) => {
  const speciesName = genome.common_name ?? genome.scientific_name;
  const assemblyName = genome.assembly.name;

  return `${speciesName} ${assemblyName}`;
};

export default StructuralVariantsTopBar;
