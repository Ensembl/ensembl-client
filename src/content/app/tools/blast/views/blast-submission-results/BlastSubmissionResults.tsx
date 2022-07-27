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
import { useAppDispatch, useAppSelector } from 'src/store';
import { useLocation, useNavigate } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { parseBlastInput } from '../../utils/blastInputParser';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
import { getFormattedDateTime } from 'src/shared/helpers/formatters/dateFormatter';

import BlastAppBar from 'src/content/app/tools/blast/components/blast-app-bar/BlastAppBar';
import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import BlastViewsNavigation from 'src/content/app/tools/blast/components/blast-views-navigation/BlastViewsNavigation';
import { Props } from 'src/content/app/tools/blast/components/listed-blast-submission/ListedBlastSubmission';
import ButtonLink from 'src/shared/components/button-link/ButtonLink';
import DeleteButton from 'src/shared/components/delete-button/DeleteButton';
import DownloadButton from 'src/shared/components/download-button/DownloadButton';
import BlastSubmissionHeaderGrid from '../../components/blast-submission-header-container/BlastSubmissionHeaderGrid';

import { BlastProgram } from '../../types/blastSettings';

import { getBlastSubmissionById } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';
import {
  BlastSubmission,
  deleteBlastSubmission
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import { useFetchBlastSubmissionQuery } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import {
  fillBlastForm,
  Species
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import styles from './BlastSubmissionResults.scss';

const BlastSubmissionResults = () => {
  return (
    <div>
      <BlastAppBar view="submission-results" />
      <ToolsTopBar>
        <BlastViewsNavigation />
      </ToolsTopBar>
      <Main />
    </div>
  );
};

const Header = (props: Props) => {
  const { submission } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const blastProgram =
    submission.submittedData.parameters.program.toUpperCase();
  const submissionId = submission.id;
  const submissionTime = getFormattedDateTime(new Date(submission.submittedAt));

  const editSubmission = () => {
    const { sequences, species, parameters } = submission.submittedData;
    const parsedSequences = sequences.flatMap((sequence) =>
      parseBlastInput(sequence.value)
    );
    const { title, program, stype, ...otherParameters } = parameters;

    const payload = {
      sequences: parsedSequences,
      selectedSpecies: species,
      settings: {
        jobName: title,
        sequenceType: stype,
        program: program as BlastProgram,
        parameters: otherParameters
      }
    };
    dispatch(fillBlastForm(payload));
    navigate(urlFor.blastForm());
  };

  const handleDeletion = () => {
    dispatch(deleteBlastSubmission(submissionId));
  };

  return (
    <BlastSubmissionHeaderGrid>
      <div>{blastProgram}</div>
      <div>
        <span className={styles.submissionIdLabel}>Submission</span>
        <span>{submissionId}</span>
        <span className={styles.editSubmission} onClick={editSubmission}>
          Edit/rerun
        </span>
        <span className={styles.timeStamp}>
          <span>{submissionTime}</span>
          <span className={styles.timeZone}>GMT</span>
        </span>
      </div>
      <div className={styles.controlButtons}>
        <DeleteButton onClick={handleDeletion} />
        <DownloadButton className={styles.inactiveButton} />
        <ButtonLink
          to={urlFor.blastSubmission(submissionId)}
          isDisabled={false}
        >
          Results
        </ButtonLink>
      </div>
    </BlastSubmissionHeaderGrid>
  );
};

const Main = () => {
  const location = useLocation();
  const submissionId = location.pathname.split('/').slice(-1)[0];
  const blastSubmission = useAppSelector((state) =>
    getBlastSubmissionById(state, submissionId)
  );

  if (!blastSubmission) {
    return null;
  }
  return (
    <div className={styles.blastSubmissionResultsContainer}>
      <Header submission={blastSubmission} />
      <SequenceBox submission={blastSubmission} />
    </div>
  );
};

type SequenceBoxProps = {
  submission: BlastSubmission;
};

const SequenceBox = (props: SequenceBoxProps) => {
  const { submittedData, results: blastResults } = props.submission;

  const resultsGroupedBySequence = submittedData.sequences.map((sequence) => {
    const results = blastResults.filter((r) => r.sequenceId === sequence.id);
    return {
      sequence,
      results
    };
  });

  return (
    <>
      {resultsGroupedBySequence.map((data) => (
        <div key={data.sequence.id} className={styles.sequenceBoxWrapper}>
          <div className={styles.resultsSummaryRow}>
            <div>Sequence {data.sequence.id}</div>
            <div>
              {'>' + (parseBlastInput(data.sequence.value)[0].header || '')}
            </div>
            <div>
              <span className={styles.label}>Against</span>{' '}
              <span className={styles.boldText}>
                {submittedData.species.length} species{' '}
              </span>
            </div>
          </div>

          {data.results.map((result) => {
            const species = submittedData.species.filter(
              (s) => s.genome_id === result.genomeId
            );
            return (
              <SingleBlastJobResult
                key={result.jobId}
                species={species[0]}
                jobId={result.jobId}
              />
            );
          })}
          <div className={styles.ruler}></div>
        </div>
      ))}
    </>
  );
};

type SingleBlastJobResultProps = {
  jobId: string;
  species: Species;
};

const SingleBlastJobResult = (props: SingleBlastJobResultProps) => {
  const { data } = useFetchBlastSubmissionQuery(props.jobId);

  if (!data) {
    return null;
  }

  const { species: speciesInfo } = props;
  return (
    <div className={styles.resultsSummaryRow}>
      <div>
        <span className={styles.boldText}>{data.result.hits.length} </span>
        <span className={styles.label}>
          {' '}
          {`${pluralise('hit', data.result.hits.length)}`}{' '}
        </span>
      </div>
      <div className={styles.summaryPlot}></div>
      <div className={styles.speciesInfo}>
        {speciesInfo.common_name && <span>{speciesInfo.common_name}</span>}
        <span>{speciesInfo.scientific_name}</span>
        <span>{speciesInfo.assembly_name}</span>
      </div>
    </div>
  );
};

export default BlastSubmissionResults;
