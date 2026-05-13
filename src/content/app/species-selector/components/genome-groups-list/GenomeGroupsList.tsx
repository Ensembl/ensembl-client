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

import Pill from 'src/shared/components/pill/Pill';

import type {
  GenomeGroup,
  GenomeGroupCategory
} from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import styles from './GenomeGroupsList.module.css';

type Props = {
  category: GenomeGroupCategory;
};

const GenomeGroupsList = (props: Props) => {
  const { category } = props;

  if (!category.groups.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      {category.groups.map((group) => (
        <GenomeGroupItem key={group.group_id} group={group} />
      ))}
    </div>
  );
};

const GenomeGroupItem = (props: { group: GenomeGroup }) => {
  const { group } = props;

  return (
    <section className={styles.group}>
      <h2 className={styles.groupTitle}>{group.title}</h2>
      {group.description && (
        <p className={styles.description}>{group.description}</p>
      )}
      <div className={styles.genomesCount}>
        <Pill>{group.genomes_count}</Pill>
        <span>genomes</span>
      </div>
    </section>
  );
};

export default GenomeGroupsList;
