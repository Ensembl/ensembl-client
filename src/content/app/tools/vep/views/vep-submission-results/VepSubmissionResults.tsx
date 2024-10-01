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

import { useState, useEffect, type ChangeEvent } from 'react';
import { useParams } from 'react-router';
import noop from 'lodash/noop';

import { useAppSelector, useAppDispatch } from 'src/store';
import useVepResultsPagination, {
  PER_PAGE_OPTIONS
} from './hooks/useVepResultsPagination';

import {
  getVepSubmissionsRestoredFlag,
  getVepSubmissionById
} from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSelectors';

import { useVepResultsQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';
import { updateSubmission } from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSlice';

import useVepVariantTabularData, {
  type VepResultsTableRowData,
  type ExpandedTranscriptsPath
} from './useVepVariantTabularData';

import {
  areVepSubmissionResultsExpired,
  isFailedVepSubmission
} from 'src/content/app/tools/vep/utils/vepResultsAvailability';

import VepSubmissionHeader from 'src/content/app/tools/vep/components/vep-submission-header/VepSubmissionHeader';
import VepInputSummary from 'src/content/app/tools/vep/components/vep-input-summary/VepInputSummary';
import { Table, ColumnHead } from 'src/shared/components/table';
import VariantConsequence from 'src/shared/components/variant-consequence/VariantConsequence';
import VepResultsGene from './components/vep-results-gene/VepResultsGene';
import VepResultsLocation from './components/vep-results-location/VepResultsLocation';
import VepResultsAllele from './components/vep-results-allele/VepResultsAllele';
import Pill from 'src/shared/components/pill/Pill';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import SpeciesName from 'src/shared/components/species-name/SpeciesName';
import Pagination from 'src/shared/components/pagination/Pagination';
import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import { CircleLoader } from 'src/shared/components/loader';
import MissingVepSubmissionError from 'src/content/app/tools/vep/components/missing-vep-submission-error/MissingVepSubmissionError';

import type { VepSubmissionWithoutInputFile } from 'src/content/app/tools/vep/types/vepSubmission';
import type { VepResultsResponse } from 'src/content/app/tools/vep/types/vepResultsResponse';

import styles from './VepSubmissionResults.module.css';

/**
 * TODO:
 * - Add unique id to variants after they are requested (to use for keys)
 */

const VepSubmissionResults = () => {
  const { submissionId } = useParams() as { submissionId: string };
  const { page, perPage, setPage, setPerPage } = useVepResultsPagination();
  const {
    data: vepResults,
    isLoading,
    isFetching
  } = useVepResultsQuery({
    submission_id: submissionId,
    page,
    per_page: perPage
  });
  const areSubmissionsRestored = useAppSelector(getVepSubmissionsRestoredFlag);
  const submission = useAppSelector((state) =>
    getVepSubmissionById(state, submissionId)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // When user views a VEP submission for the first time, mark it as seen
    if (vepResults && submission && !submission.resultsSeen) {
      dispatch(
        updateSubmission({
          submissionId: submission.id,
          fragment: { resultsSeen: true }
        })
      );
    }
  }, [submission, vepResults]);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  if (!areSubmissionsRestored) {
    // Reading data from IndexedDB is an asynchronous process that takes some time;
    // so it is possible for this component to render before VEP submissions stored in IndexedDB have been read
    return null;
  } else if (!submission || isFailedVepSubmission(submission)) {
    return <MissingVepSubmissionError isExpiredSubmission={false} />;
  } else if (areVepSubmissionResultsExpired(submission)) {
    return <MissingVepSubmissionError isExpiredSubmission={true} />;
  } else if (isLoading) {
    // fetching data for the first time
    return (
      <div className={styles.fullPageSpinnerContainer}>
        <CircleLoader />
      </div>
    );
  } else if (!vepResults) {
    // TODO: handle errors
    return null;
  }

  const {
    metadata: { pagination: paginationMetadata }
  } = vepResults;
  const { per_page, total } = paginationMetadata;
  const maxPage = Math.ceil(total / per_page);

  return (
    <div className={styles.container}>
      <VepSubmissionHeader submission={submission} />
      <div className={styles.resultsBox}>
        <VepResultsHeader
          submission={submission}
          page={page}
          maxPage={maxPage}
          onPageChange={onPageChange}
          perPage={perPage}
          onPerPageChange={setPerPage}
        />
        <div className={styles.tableViewportWrapper}>
          {isFetching && (
            <div className={styles.tableLoadingOverlay}>
              <CircleLoader className={styles.tableLoadingSpinner} />
            </div>
          )}
          <div className={styles.tableViewport}>
            <VepResultsTable variants={vepResults.variants} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * A component that sits inside of the results box above the table of results,
 * and contains the species name, paginator, and other stuff
 */
const VepResultsHeader = ({
  submission,
  page,
  perPage,
  maxPage,
  onPageChange,
  onPerPageChange
}: {
  submission: VepSubmissionWithoutInputFile;
  page: number;
  perPage: number;
  maxPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (page: number) => void;
}) => {
  const { species } = submission;
  const perPageOptions = PER_PAGE_OPTIONS.map((option) => ({
    label: `${option}`,
    value: `${option}`
  }));

  const handlePerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    onPerPageChange(Number(value));
  };

  // TODO: decide what to do with the pagination component when all results can fit in one page

  return (
    <div className={styles.resultsBoxHeader}>
      <SpeciesName
        species={
          species as NonNullable<VepSubmissionWithoutInputFile['species']>
        }
      />
      <VepInputSummary submission={submission} />
      <div className={styles.perPage}>
        <SimpleSelect
          options={perPageOptions}
          value={`${perPage}`}
          onChange={handlePerPageChange}
        />
        <span className={styles.perPageLabel}>per page</span>
      </div>
      <Pagination
        onChange={onPageChange}
        currentPageNumber={page}
        lastPageNumber={maxPage}
        className={styles.pagination}
      />
      <div>
        <MockFiltersToggle />
      </div>
    </div>
  );
};

const MockFiltersToggle = () => {
  return (
    <ShowHide
      className={styles.mockFiltersToggle}
      onClick={noop}
      isExpanded={false}
      label="Filters"
    />
  );
};

const VepResultsTable = (props: {
  variants: VepResultsResponse['variants'];
}) => {
  const { variants } = props;

  return (
    <Table className={styles.table}>
      <thead>
        <tr>
          <ColumnHead>Variant</ColumnHead>
          <ColumnHead>Ref</ColumnHead>
          <ColumnHead>Location</ColumnHead>
          <ColumnHead>Alt allele</ColumnHead>
          <ColumnHead>Genes</ColumnHead>
          <ColumnHead>Transcripts</ColumnHead>
          <ColumnHead>Predicted molecular consequence</ColumnHead>
        </tr>
      </thead>
      <tbody>
        {/* Use something more reliable for key than index */}
        {variants.map((variant, index) => (
          <VariantRow variant={variant} key={index} />
        ))}
      </tbody>
    </Table>
  );
};

const VariantRow = (props: {
  variant: VepResultsResponse['variants'][number];
}) => {
  const [expandedTranscriptPaths, setExpandedTranscriptPaths] = useState<
    ExpandedTranscriptsPath[]
  >([]);

  const tabularData = useVepVariantTabularData({
    variant: props.variant,
    expandedTranscriptPaths
  });

  const toggleExpandedTranscripts = (
    altAllele: string,
    geneId: string,
    action: 'expand' | 'collapse'
  ) => {
    if (action === 'expand') {
      const newTranscriptPath = { altAllele, geneId };
      setExpandedTranscriptPaths([
        ...expandedTranscriptPaths,
        newTranscriptPath
      ]);
    } else {
      const updatedPaths = expandedTranscriptPaths.filter((path) => {
        return path.altAllele !== altAllele || path.geneId !== geneId;
      });
      setExpandedTranscriptPaths(updatedPaths);
    }
  };

  return tabularData.map((row, index) => (
    <tr key={index}>
      {row.variant && (
        <>
          <td
            rowSpan={row.variant.rowspan > 1 ? row.variant.rowspan : undefined}
          >
            <VariantName variant={row.variant} />
          </td>
          <td
            rowSpan={row.variant.rowspan > 1 ? row.variant.rowspan : undefined}
          >
            <VepResultsAllele sequence={row.variant.referenceAllele} />
          </td>
          <td
            rowSpan={row.variant.rowspan > 1 ? row.variant.rowspan : undefined}
          >
            <VepResultsLocation
              genomeId="grch38"
              location={row.variant.location}
            />
          </td>
        </>
      )}
      {row.alternativeAllele && (
        <td
          rowSpan={
            row.alternativeAllele.rowspan > 1
              ? row.alternativeAllele.rowspan
              : undefined
          }
        >
          <VepResultsAllele sequence={row.alternativeAllele.allele_sequence} />
        </td>
      )}
      <GeneTableCell row={row} />
      <TranscriptTableCell
        row={row}
        expandedTranscriptPaths={expandedTranscriptPaths}
        toggleExpanded={toggleExpandedTranscripts}
      />
      <td>
        <VariantConsequences consequences={row.consequence.consequences} />
      </td>
    </tr>
  ));
};

const GeneTableCell = (props: { row: VepResultsTableRowData }) => {
  const { row } = props;

  if (row.gene) {
    return (
      <td rowSpan={row.gene.rowspan > 1 ? row.gene.rowspan : undefined}>
        <VepResultsGene {...row.gene} genomeId="grch38" />
      </td>
    );
  } else if (row.consequence.feature_type === null) {
    // for an intergenic consequence, render an empty cell
    return <td />;
  } else {
    return null;
  }
};

const TranscriptTableCell = (props: {
  row: VepResultsTableRowData;
  expandedTranscriptPaths: ExpandedTranscriptsPath[];
  toggleExpanded: (
    altAllele: string,
    geneId: string,
    action: 'expand' | 'collapse'
  ) => void;
}) => {
  const { row, expandedTranscriptPaths, toggleExpanded } = props;

  if (row.consequence.feature_type !== 'transcript') {
    return <td />;
  }

  const transcriptConsequence = row.consequence;
  const { totalTranscriptsCount, isLastTranscript } = transcriptConsequence;
  const isExpanded = Boolean(
    expandedTranscriptPaths.find(({ altAllele, geneId }) => {
      return (
        altAllele === transcriptConsequence.altAlleleSequence &&
        geneId === transcriptConsequence.gene_stable_id
      );
    })
  );

  const onTranscriptClick = () => {
    toggleExpanded(
      transcriptConsequence.altAlleleSequence,
      transcriptConsequence.gene_stable_id,
      isExpanded ? 'collapse' : 'expand'
    );
  };

  return (
    <td>
      <VariantTranscript transcript={row.consequence} />
      {!isExpanded && totalTranscriptsCount > 1 && (
        <div>
          <button onClick={onTranscriptClick} className={styles.expandButton}>
            <Pill>+ {totalTranscriptsCount - 1}</Pill>
            <span className={styles.smallLight}>transcripts</span>
          </button>
        </div>
      )}
      {isExpanded && totalTranscriptsCount > 1 && isLastTranscript && (
        <div>
          <CloseButton
            onClick={onTranscriptClick}
            className={styles.collapseButton}
          />
        </div>
      )}
    </td>
  );
};

const VariantName = (props: {
  variant: NonNullable<VepResultsTableRowData['variant']>;
}) => {
  return (
    <>
      <div>{props.variant.name}</div>
      <div className={styles.smallLight}>{props.variant.allele_type}</div>
    </>
  );
};

const VariantTranscript = (props: {
  transcript: {
    stable_id: string;
    biotype: string;
  };
}) => {
  return (
    <>
      <div>{props.transcript.stable_id}</div>
      <div className={styles.smallLight}>{props.transcript.biotype}</div>
    </>
  );
};

const VariantConsequences = ({ consequences }: { consequences: string[] }) => {
  return consequences.map((consequence) => (
    <div key={consequence}>
      <VariantConsequence consequence={consequence} />
    </div>
  ));
};

export default VepSubmissionResults;
