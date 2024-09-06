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

import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getVepSubmissionById } from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSelectors';

import { useVepResultsQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';
import { updateSubmission } from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSlice';

import useVepVariantTabularData, {
  type VepResultsTableRowData,
  type ExpandedTranscriptsPath
} from './useVepVariantTabularData';

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
import { CircleLoader } from 'src/shared/components/loader';

import type { VepSubmissionWithoutInputFile } from 'src/content/app/tools/vep/types/vepSubmission';
import type { VepResultsResponse } from 'src/content/app/tools/vep/types/vepResultsResponse';

import styles from './VepSubmissionResults.module.css';

/**
 * TODO:
 * - Add unique id to variants after they are requested (to use for keys)
 * - Consider pagination (should it be part of url?)
 */

const VepSubmissionResults = () => {
  const { submissionId } = useParams() as { submissionId: string };
  const [page, setPage] = useState(1); // FIXME: read page number from url params, and validate
  const {
    data: vepResults,
    isLoading,
    isFetching
  } = useVepResultsQuery({
    submission_id: submissionId,
    page,
    per_page: 100
  });
  const submission = useAppSelector((state) =>
    getVepSubmissionById(state, submissionId)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
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

  if (!submission) {
    // TODO:
    // - Submission may not exist; in which case we should show an error screen
    // - However, note that reading submissions from IndexedDB will take time;
    //   so will need some way to detect in the component that IndexedDB read has finished
    return null;
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
        />
        <div className={styles.tableWrapper}>
          {isFetching && (
            <div className={styles.tableLoadingOverlay}>
              <CircleLoader className={styles.tableLoadingSpinner} />
            </div>
          )}
          <VepResultsTable variants={vepResults.variants} />
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
  maxPage,
  onPageChange
}: {
  submission: VepSubmissionWithoutInputFile;
  page: number;
  maxPage: number;
  onPageChange: (page: number) => void;
}) => {
  const { species } = submission;

  // TODO: decide what to do with the pagination component when all results can fit in one page

  return (
    <div className={styles.resultsBoxHeader}>
      <SpeciesName
        species={
          species as NonNullable<VepSubmissionWithoutInputFile['species']>
        }
      />
      <VepInputSummary submission={submission} />
      <Pagination
        onChange={onPageChange}
        currentPageNumber={page}
        lastPageNumber={maxPage}
        className={styles.pagination}
      />
    </div>
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
