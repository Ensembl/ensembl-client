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

import { useFetchBlastSubmissionQuery } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import BlastHitsDiagram from 'src/content/app/tools/blast/components/blast-hits-diagram/BlastHitsDiagram';

import type { BlastJob } from 'src/content/app/tools/blast/types/blastJob';
import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import styles from './SingleBlastJobResult.scss';

type SingleBlastJobResultProps = {
  jobId: string;
  species: Species;
  diagramWidth: number;
};

const SingleBlastJobResult = (props: SingleBlastJobResultProps) => {
  const { species: speciesInfo, diagramWidth } = props;
  const { data } = useFetchBlastSubmissionQuery(props.jobId);

  if (!data) {
    return null;
  }

  const alignmentsCount = countAlignments(data.result);

  return (
    <div className={styles.resultsSummaryRow}>
      <div className={styles.hitLabel}>
        <span>{alignmentsCount} </span>
        <span>{`${pluralise('hit', alignmentsCount)}`}</span>
      </div>
      <div className={styles.summaryPlot}>
        <BlastHitsDiagram job={data.result} width={diagramWidth} />
      </div>
      <div className={styles.speciesInfo}>
        {speciesInfo.common_name && <span>{speciesInfo.common_name}</span>}
        <span>{speciesInfo.scientific_name}</span>
        <span>{speciesInfo.assembly_name}</span>
      </div>
    </div>
  );
};

const countAlignments = (blastJob: BlastJob) => {
  return blastJob.hits.reduce((count, hit) => count + hit.hit_hsps.length, 0);
};

export default SingleBlastJobResult;
