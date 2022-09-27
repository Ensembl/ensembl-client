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

import Copy from 'src/shared/components/copy/Copy';

import type { BlastSubmissionParameters } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import type { DatabaseType } from 'src/content/app/tools/blast/types/blastSettings';

import styles from './JobParameters.scss';

const databaseLabelsMap: Record<DatabaseType, string> = {
  dna: 'Genomic sequence',
  cdna: 'cDNA',
  pep: 'Protein sequence'
};

type JobParametersProps = {
  sequenceValue: string;
  preset: string;
  parameters: BlastSubmissionParameters;
};

const JobParameters = (props: JobParametersProps) => {
  const { sequenceValue, parameters } = props;

  return (
    <div className={styles.submissionParameters}>
      <div className={styles.copySequence}>
        <Copy value={sequenceValue} />
      </div>
      <div className={styles.sequence}>{sequenceValue}</div>
      <div className={styles.parameters}>
        <table>
          <tbody>
            <tr>
              <td>Database</td>
              <td>{databaseLabelsMap[parameters.database as DatabaseType]}</td>
            </tr>
            <tr>
              <td>Sensitivity</td>
              <td>{props.preset}</td>
            </tr>
            <tr>
              <td>Max. alignments</td>
              <td>{parameters.alignments}</td>
            </tr>
            <tr>
              <td>Max. scores</td>
              <td>{parameters.scores}</td>
            </tr>
            <tr>
              <td>E-threshold</td>
              <td>{parameters.exp}</td>
            </tr>
            <tr>
              <td>Statistical accuracy</td>
              <td>{parameters.compstats}</td>
            </tr>
            <tr>
              <td>HSPs per hit</td>
              <td>{parameters.hsps}</td>
            </tr>
            <tr>
              <td>Drop-off</td>
              <td>{parameters.dropoff}</td>
            </tr>
            <tr>
              <td>GAP opening</td>
              <td>{parameters.gapopen}</td>
            </tr>
            <tr>
              <td>GAP estension</td>
              <td>{parameters.gapext}</td>
            </tr>
            <tr>
              <td>Word size</td>
              <td>{parameters.wordsize}</td>
            </tr>
            <tr>
              <td>Match/Mismatch score</td>
              <td>{parameters.match_scores}</td>
            </tr>
            {parameters.gapalign === 'true' && (
              <tr>
                <td></td>
                <td>
                  <div className={styles.parameterCheckbox} />
                  <span>Align gaps</span>
                </td>
              </tr>
            )}
            {parameters.filter === 'T' && (
              <tr>
                <td></td>
                <td>
                  <div className={styles.parameterCheckbox} />
                  <span>Filter low complexity regions</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobParameters;
