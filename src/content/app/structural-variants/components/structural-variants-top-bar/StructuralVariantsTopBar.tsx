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

import type { ChangeEvent } from 'react';
import classNames from 'classnames';

import { useAppSelector, useAppDispatch } from 'src/store';

import {
  getReferenceGenome,
  getAlternativeGenome
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

import {
  useGenomeGroupsQuery,
  useGenomesInGroupQuery
} from 'src/content/app/structural-variants/state/api/structuralVariantsApiSlice';
import { useExampleObjectsForGenomeQuery } from 'src/shared/state/genome/genomeApiSlice';
import {
  setReferenceGenome,
  setAlternativeGenome
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSlice';

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';

import type { GenomeGroupForStructuralVariants } from 'src/content/app/structural-variants/types/genomeGroup';
import { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';
import FlatInput from 'src/shared/components/input/FlatInput';

import styles from './StructuralVariantsTopBar.module.css';

const StructuralVariantsTopBar = () => {
  const referenceGenome = useAppSelector(getReferenceGenome);
  const alternativeGenome = useAppSelector(getAlternativeGenome);

  const { data: genomeGroupsData } = useGenomeGroupsQuery();

  const getReferenceGenomeGroupId = () => {
    if (referenceGenome) {
      const group = genomeGroupsData?.genome_groups.find(
        (group) =>
          group.reference_genome.genome_id === referenceGenome.genome_id
      );
      if (group) {
        return group.id;
      }
    }
    return '';
  };
  const referenceGenomeGroupId = getReferenceGenomeGroupId();

  const { currentData: genomesInGroup } = useGenomesInGroupQuery(
    referenceGenomeGroupId,
    {
      skip: !referenceGenomeGroupId
    }
  );

  const { currentData: exampleObjects } = useExampleObjectsForGenomeQuery(
    referenceGenome?.genome_id ?? '',
    {
      skip: !referenceGenome
    }
  );

  const dispatch = useAppDispatch();

  const onGenomeGroupSelected = (event: ChangeEvent<HTMLSelectElement>) => {
    const groupId = event.currentTarget.value;
    const genomeGroup = genomeGroupsData?.genome_groups.find(
      (group) => group.id === groupId
    );

    if (!genomeGroup) {
      // this should not happen
      return;
    }
    const referenceGenome = genomeGroup.reference_genome;
    dispatch(setReferenceGenome({ genome: referenceGenome }));
  };

  const onAlternativeGenomeSelected = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const genomeId = event.currentTarget.value;
    const genome = genomesInGroup?.genomes.find(
      (genome) => genome.genome_id === genomeId
    );

    if (genome) {
      dispatch(setAlternativeGenome({ genome }));
    }
  };

  const getReferenceGenomeLocation = () => {
    // TODO: prioritise the location from user's input (or url, or what the component reports)
    // over the example location
    const exampleLocation = exampleObjects?.find(
      (object) => object.type === 'location'
    );
    return exampleLocation?.id ?? '';
  };

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
        options={getGenomeGroupsOptions(genomeGroupsData?.genome_groups ?? [])}
        placeholder="Select"
        value={getReferenceGenomeGroupId()}
        onChange={onGenomeGroupSelected}
      />

      <span className={classNames(styles.withBothMargins, styles.light)}>
        in region
      </span>

      <FlatInput defaultValue={getReferenceGenomeLocation()} />

      <span className={classNames(styles.withBothMargins, styles.light)}>
        and
      </span>

      <SimpleSelect
        className={styles.select}
        options={getAltGenomeOptions({
          genomes: genomesInGroup?.genomes ?? [],
          referenceGenome: referenceGenome as BriefGenomeSummary
        })}
        placeholder="Select"
        disabled={!genomesInGroup}
        value={alternativeGenome?.genome_id ?? ''}
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
