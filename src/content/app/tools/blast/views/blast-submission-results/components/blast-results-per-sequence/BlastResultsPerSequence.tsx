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

import { useRef, useState } from 'react';

import useResizeObserver from 'src/shared/hooks/useResizeObserver';

import ShowHide from 'src/shared/components/show-hide/ShowHide';
import FeatureLengthRuler from 'src/shared/components/feature-length-ruler/FeatureLengthRuler';
import JobParameters from '../job-parameters/JobParameters';
import SingleBlastJobResult from '../single-blast-job-result/SingleBlastJobResult';
import { BlastGenomicHitsDiagramLegend } from 'src/content/app/tools/blast/components/blast-genomic-hits-diagram';
import { JobStatus } from 'src/content/app/tools/blast/components/listed-blast-submission/ListedBlastSubmission';

import type {
  BlastJobWithResults,
  BlastSubmission
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import type { SubmittedSequence } from 'src/content/app/tools/blast/types/blastSequence';

import styles from './BlastResultsPerSequence.module.css';

type BlastResultsPerSequenceProps = {
  sequence: SubmittedSequence;
  species: Species[];
  blastResults: BlastJobWithResults[];
  submission: BlastSubmission;
};

const BlastResultsPerSequence = (props: BlastResultsPerSequenceProps) => {
  const {
    sequence,
    species,
    blastResults,
    submission: {
      submittedData: { parameters, preset }
    }
  } = props;
  const { header: sequenceHeader, value: sequenceValue } = sequence;
  const sequenceHeaderLabel =
    '>' + (sequenceHeader ?? `Sequence ${sequence.id}`);

  const rulerContainer = useRef<HTMLDivElement | null>(null);
  const { width: plotwidth } = useResizeObserver({ ref: rulerContainer });
  const [shouldShowJobResult, showJobResult] = useState(true);
  const [shouldShowParamaters, showParamaters] = useState(false);
  const shouldUseGenomicHitsDiagram =
    parameters.database === 'dna_sm' || parameters.database === 'dna'; // NOTE: works for now; but likely to expand in the future

  const headerClasses = shouldUseGenomicHitsDiagram
    ? styles.headerWithLegend
    : undefined;

  const haveAllJobsFailed = blastResults.every(
    (job) => job.status === 'FAILURE'
  );

  if (haveAllJobsFailed) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.resultsSummaryRow}>
          <div>Sequencess {sequence.id}</div>
          <div className={styles.sequenceHeader}>
            <div className={headerClasses}>
              <ShowHide
                label={sequenceHeaderLabel}
                isExpanded={shouldShowParamaters}
                onClick={() => showParamaters(!shouldShowParamaters)}
              />
            </div>
            {shouldShowParamaters && (
              <JobParameters
                sequenceValue={sequence.value}
                parameters={parameters}
                preset={preset}
              />
            )}
          </div>
          <div>
            <span className={styles.againstText}>Against</span>{' '}
            <span>{species.length} species</span>
          </div>
          <span className={styles.failedJob}>Job failed</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.wrapper}>
        <div className={styles.resultsSummaryRow}>
          <div>Sequence {sequence.id}</div>
          <div className={styles.sequenceHeader}>
            <div className={headerClasses}>
              <ShowHide
                label={sequenceHeaderLabel}
                isExpanded={shouldShowParamaters}
                onClick={() => showParamaters(!shouldShowParamaters)}
              />
              {shouldUseGenomicHitsDiagram && <BlastGenomicHitsDiagramLegend />}
            </div>
            {shouldShowParamaters && (
              <JobParameters
                sequenceValue={sequence.value}
                parameters={parameters}
                preset={preset}
              />
            )}
          </div>

          <div>
            <span className={styles.againstText}>Against</span>{' '}
            <span>{species.length} species</span>
          </div>
          <div className={styles.showHideWrapper}>
            {!shouldShowJobResult && (
              <span className={styles.collapsedJobStatus}>
                <JobStatus jobs={blastResults} />
              </span>
            )}
            <ShowHide
              isExpanded={shouldShowJobResult}
              onClick={() => showJobResult(!shouldShowJobResult)}
            ></ShowHide>
          </div>
        </div>

        {shouldShowJobResult &&
          blastResults.map((result) => {
            // TODO: Do we need to show a message if there isn't any matching species? Or will this even ever happen?
            const speciesInfo = species.find(
              (sp) => sp.genome_id === result.genomeId
            ) as Species;

            return (
              <SingleBlastJobResult
                key={result.jobId}
                species={speciesInfo}
                jobResult={result}
                diagramWidth={plotwidth}
                submission={props.submission}
              />
            );
          })}
        <div className={styles.rulerPlacementGrid}>
          <div ref={rulerContainer} className={styles.rulerContainer}>
            {shouldShowJobResult && !shouldUseGenomicHitsDiagram && (
              <FeatureLengthRuler
                rulerLabel="Length"
                rulerLabelOffset={2.5}
                width={plotwidth}
                length={sequenceValue.length}
                standalone={true}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default BlastResultsPerSequence;
