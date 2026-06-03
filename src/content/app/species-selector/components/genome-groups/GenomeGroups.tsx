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

import { Link } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import Pill from 'src/shared/components/pill/Pill';

import type {
  GenomeGroup as GenomeGroupType,
  GenomeGroupCategory
} from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import styles from './GenomeGroups.module.css';

type Props = {
  category: GenomeGroupCategory;
};

const GenomeGroups = (props: Props) => {
  const { category } = props;

  return (
    <div className={styles.container}>
      {category.groups.map((group) => (
        <GenomeGroup key={group.group_id} group={group} />
      ))}
    </div>
  );
};

const GenomeGroup = (props: { group: GenomeGroupType }) => {
  const { group } = props;

  return (
    <div className={styles.group}>
      <span className={styles.groupTitle}>{group.title}</span>
      {group.description && (
        <p className={styles.description}>{group.description}</p>
      )}
      <Link
        className={styles.genomesCount}
        to={urlFor.speciesSelectorSearch({
          genomeGroupId: group.group_id
        })}
      >
        <Pill>{group.genomes_count}</Pill>
        <span>genomes</span>
      </Link>
    </div>
  );
};

export default GenomeGroups;
