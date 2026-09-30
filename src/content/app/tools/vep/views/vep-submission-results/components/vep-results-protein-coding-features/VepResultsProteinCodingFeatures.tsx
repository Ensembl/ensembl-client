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

import { Fragment, memo } from 'react';
import classNames from 'classnames';

import type { ProteinCodingFeatures } from 'src/content/app/tools/vep/types/vepResultsResponse';

import commonStyles from '../../VepSubmissionResults.module.css';
import styles from './VepResultsProteinCodingFeatures.module.css';

type Props = {
  features: ProteinCodingFeatures;
};

const VepResultsProteinCodingFeatures = (props: Props) => {
  const {
    exon,
    intron,
    cdna_position,
    cds_position,
    protein_position,
    amino_acids,
    codons
  } = props.features;

  const rows = [
    ['Exon', exon],
    ['Intron', intron],
    ['cDNA position', cdna_position],
    ['CDS position', cds_position],
    ['Codons', codons],
    ['Protein position', protein_position],
    ['Amino acids', amino_acids]
  ].filter((row): row is [string, string] => Boolean(row[1]));

  if (!rows.length) {
    return null;
  }

  return (
    <dl className={styles.features}>
      {rows.map(([label, value]) => (
        <Fragment key={label}>
          <dt className={classNames(commonStyles.smallLight, styles.label)}>
            {label}
          </dt>
          <dd className={styles.value}>{value}</dd>
        </Fragment>
      ))}
    </dl>
  );
};

export default memo(VepResultsProteinCodingFeatures);
