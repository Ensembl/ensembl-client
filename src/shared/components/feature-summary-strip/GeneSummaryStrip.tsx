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

import classNames from 'classnames';
import type { RefObject } from 'react';

import { getDisplayStableId } from 'src/shared/helpers/focusObjectHelpers';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';

import { FocusGene } from 'src/shared/types/focus-object/focusObjectTypes';

import styles from './FeatureSummaryStrip.module.css';

type GeneFields =
  | 'bio_type'
  | 'label'
  | 'versioned_stable_id'
  | 'stable_id'
  | 'strand'
  | 'location';
type Gene = Pick<FocusGene, GeneFields>;

type Props = {
  gene: Gene;
  className?: string;
  ref?: RefObject<HTMLDivElement | null>;
};

const GeneSummaryStrip = (props: Props) => {
  const { gene } = props;

  const stripClasses = classNames(styles.featureSummaryStrip, props.className);

  return (
    <div className={stripClasses} ref={props.ref}>
      <GeneName {...props} />
      <Biotype {...props} />
      {gene.strand && (
        <div className={styles.section}>
          {getStrandDisplayName(gene.strand)}
        </div>
      )}
      <div className={styles.section}>
        {getFormattedLocation(gene.location)}
      </div>
    </div>
  );
};

const GeneName = ({ gene }: Pick<Props, 'gene'>) => {
  const stableId = getDisplayStableId(gene);

  return (
    <div className={styles.section}>
      <span className={styles.featureSummaryStripLabel}>Gene</span>
      {gene.label && (
        <span className={styles.featureNameEmphasized}>{gene.label}</span>
      )}
      {gene.label !== stableId && <span>{stableId}</span>}
    </div>
  );
};

const Biotype = ({ gene }: Pick<Props, 'gene'>) => {
  return (
    gene.bio_type && (
      <div className={styles.section}>
        <span className={styles.featureSummaryStripLabel}>Biotype</span>
        {gene.bio_type}
      </div>
    )
  );
};

export default GeneSummaryStrip;
