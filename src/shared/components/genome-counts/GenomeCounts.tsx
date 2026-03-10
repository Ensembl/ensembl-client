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

import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useGenomeCountsQuery } from 'src/shared/state/release/releaseApiSlice';

import { SpeciesSelectorIcon } from 'src/shared/components/app-icon';

import type { GenomeCounts as GenomeCountsData } from 'src/shared/state/release/releaseTypes';

import styles from './GenomeCounts.module.css';

type Variety = 'compact' | 'full';

type Props = {
  className?: string;
  variety: Variety;
};

type PropsWithData = {
  className?: string;
  data: GenomeCountsData;
};

const GenomeCounts = (props: Props) => {
  const { currentData } = useGenomeCountsQuery();

  if (!currentData) {
    return null;
  }

  return props.variety === 'compact' ? (
    <GenomeCountsCompact {...props} data={currentData} />
  ) : (
    <GenomeCountsFull {...props} data={currentData} />
  );
};

const GenomeCountsCompact = (props: PropsWithData) => {
  const containerClasses = classNames(
    styles.container,
    styles.containerCompact,
    props.className
  );
  return (
    <div className={containerClasses}>
      <SpeciesSelectorIcon className={styles.icon} />
      <div className={styles.countTotal}>{props.data.total}</div>
      <div className={styles.label}>genomes now available</div>
      <Link to={urlFor.speciesSelector()} className={styles.link}>
        Find a genome
      </Link>
    </div>
  );
};

const GenomeCountsFull = (props: PropsWithData) => {
  const containerClasses = classNames(
    styles.container,
    styles.containerFull,
    props.className
  );

  return (
    <div className={containerClasses}>
      <SpeciesSelectorIcon className={styles.icon} />
      <div className={styles.countTotal}>{props.data.total}</div>
      <div className={styles.label}>genomes now available</div>

      {props.data.counts.map(({ label, count }) => (
        <Fragment key={label}>
          <div className={styles.count}>{count}</div>
          <div className={styles.label}>{label}</div>
        </Fragment>
      ))}
    </div>
  );
};

export default GenomeCounts;
