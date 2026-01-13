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

import { use } from 'react';
import classNames from 'classnames';

import { useAppSelector } from 'src/store';

import {
  getReferenceGenome,
  getAlternativeGenome,
  getReferenceGenomeLocation,
  getAlternativeGenomeLocation
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

import { StructuralVariantsImageContext } from 'src/content/app/structural-variants/contexts/StructuralVariantsImageContext';

import styles from './StructuralVariantsMain.module.css';

const LeftColumn = () => {
  const imageContext = use(StructuralVariantsImageContext);
  const referenceGenome = useAppSelector(getReferenceGenome);
  const referenceGenomeLocation = useAppSelector(getReferenceGenomeLocation);
  const altGenome = useAppSelector(getAlternativeGenome);
  const altGenomeLocation = useAppSelector(getAlternativeGenomeLocation);

  if (!imageContext) {
    throw new Error('This component requires StructuralVariantsImageContext');
  }
  const { tracks } = imageContext;

  const geneTracks = tracks.filter((track) => track.id === 'sv-gene');
  const alignmentsTrack = tracks.find((track) => track.id === 'alignments');

  const [refGenomeGenesTrack, altGenomeGenesTrack] = geneTracks;

  const refGenomeLabel =
    referenceGenome && referenceGenomeLocation && refGenomeGenesTrack ? (
      <div
        className={styles.leftColumnLabel}
        style={{ top: `${refGenomeGenesTrack.offset}px` }}
      >
        <div>
          {referenceGenome.common_name ?? referenceGenome.scientific_name}
        </div>
        <div className={styles.light}>{referenceGenome.assembly.name}</div>
        <div className={styles.regionName}>
          <span className={styles.light}>Chr </span>{' '}
          {referenceGenomeLocation.regionName}
        </div>
      </div>
    ) : null;

  const altGenomeLabel =
    altGenome && altGenomeLocation && altGenomeGenesTrack ? (
      <div
        className={styles.leftColumnLabel}
        style={{ top: `${altGenomeGenesTrack.offset}px` }}
      >
        <div>{altGenome.common_name ?? altGenome.scientific_name}</div>
        <div className={styles.light}>{altGenome.assembly.name}</div>
        <div className={styles.regionName}>
          <span className={styles.light}>Chr </span>{' '}
          {altGenomeLocation.regionName}
        </div>
      </div>
    ) : null;

  const haplotypeVariantsLabel = alignmentsTrack ? (
    <span
      className={classNames(styles.leftColumnLabel, styles.strong)}
      style={{ top: `${alignmentsTrack.offset}px` }}
    >
      Haplotype variants
    </span>
  ) : null;

  return (
    <div className={styles.leftColumn}>
      {refGenomeLabel}
      {haplotypeVariantsLabel}
      {altGenomeLabel}
    </div>
  );
};

export default LeftColumn;
