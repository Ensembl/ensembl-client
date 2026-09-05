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

import {
  useState,
  useEffect,
  useMemo,
  useTransition,
  Fragment,
  memo,
  type ChangeEvent
} from 'react';
import { useParams } from 'react-router';

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
import { buildProtvarUrlFromHgvsg } from 'src/content/app/tools/vep/utils/buildProtvarUrlFromHgvsg';
import { buildOpenTargetsVariantId } from 'src/content/app/tools/vep/utils/openTargetsVariantId';
import { getAnnotation } from 'src/content/app/tools/vep/utils/annotations';

import VepSubmissionHeader from 'src/content/app/tools/vep/components/vep-submission-header/VepSubmissionHeader';
import VepInputSummary from 'src/content/app/tools/vep/components/vep-input-summary/VepInputSummary';
import VariantConsequence from 'src/shared/components/variant-consequence/VariantConsequence';
import VepResultsGene from './components/vep-results-gene/VepResultsGene';
import VepResultsTranscript from './components/vep-results-transcript/VepResultsTranscript';
import VepResultsLocation from './components/vep-results-location/VepResultsLocation';
import VepResultsAllele from './components/vep-results-allele/VepResultsAllele';
import VepResultsAnnotationDetail from './components/vep-results-annotation-detail/VepResultsAnnotationDetail';
import VepResultsFilters from './components/vep-results-filters/VepResultsFilters';

import { Table, ColumnHead } from 'src/shared/components/table';
import Pill from 'src/shared/components/pill/Pill';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import SpeciesName from 'src/shared/components/species-name/SpeciesName';
import Pagination from 'src/shared/components/pagination/Pagination';
import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import { CircleLoader } from 'src/shared/components/loader';
import VepSubmissionError from 'src/content/app/tools/vep/components/missing-vep-submission-error/VepSubmissionError';
import TextButton from 'src/shared/components/text-button/TextButton';

import type { VepSubmissionWithoutInputFile } from 'src/content/app/tools/vep/types/vepSubmission';
import type {
  VepResultsResponse,
  AfSource,
  HgvsgRepresentation
} from 'src/content/app/tools/vep/types/vepResultsResponse';
import type { FormPanel } from 'src/content/app/tools/vep/types/vepFormConfig';
import type { DisplaySpec } from 'src/content/app/tools/vep/types/vepDisplaySpec';
import {
  serializeResultsFilters,
  type ResultsFilterCondition
} from 'src/content/app/tools/vep/types/vepResultsFilters';

import styles from './VepSubmissionResults.module.css';

const AF_SOURCE_LABELS: Record<string, string> = {
  gnomad_exomes: 'gnomAD exomes',
  gnomad_genomes: 'gnomAD genomes',
  all_of_us: 'All of Us',
  gnomad_sv: 'gnomAD SV',
  gnomad_cnv: 'gnomAD CNV'
};

const formatAfSourceLabel = (source: AfSource): string => {
  const base = AF_SOURCE_LABELS[source.source] ?? source.source;
  return source.population ? `${base} — ${source.label}` : `${base} (overall)`;
};

/**
 * TODO:
 * - Add unique id to variants after they are requested (to use for keys)
 */

// A page-level command to open or close every annotation-detail panel at once.
// `nonce` changes on each click so row state can react even if the action
// value stays the same across separate interactions.
type DetailExpansion = {
  action: 'expand' | 'collapse';
  nonce: number;
};

const VepSubmissionResults = () => {
  const { submissionId } = useParams() as { submissionId: string };
  const { page, perPage, setPage, setPerPage } = useVepResultsPagination();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<ResultsFilterCondition[]>(
    []
  );
  const [appliedFilters, setAppliedFilters] = useState<
    ResultsFilterCondition[]
  >([]);

  const [detailExpansion, setDetailExpansion] = useState<DetailExpansion>({
    action: 'collapse',
    nonce: 0
  });

  const [isExpansionPending, startExpansionTransition] = useTransition();
  const toggleAllDetails = () => {
    startExpansionTransition(() => {
      setDetailExpansion((prev) => ({
        action: prev.action === 'expand' ? 'collapse' : 'expand',
        nonce: prev.nonce + 1
      }));
    });
  };

  const {
    data: vepResults,
    isLoading,
    isFetching,
    isError
  } = useVepResultsQuery({
    submission_id: submissionId,
    page,
    per_page: perPage,
    filters: appliedFilters
  });

  const appliedSerialized = serializeResultsFilters(appliedFilters) ?? '';
  const isFiltersDirty =
    (serializeResultsFilters(draftFilters) ?? '') !== appliedSerialized;
  const hasAppliedFilters = appliedSerialized !== '';
  // Ids of conditions that have been applied — their field select is frozen.
  const appliedConditionIds = useMemo(
    () => new Set(appliedFilters.map((condition) => condition.id)),
    [appliedFilters]
  );

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
  };
  const clearFilters = () => {
    setDraftFilters([]);
    setAppliedFilters([]);
    setPage(1);
  };
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
  }, [submission, vepResults, dispatch]);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  if (!areSubmissionsRestored) {
    // Reading data from IndexedDB is an asynchronous process that takes some time;
    // so it is possible for this component to render before VEP submissions stored in IndexedDB have been read
    return null;
  } else if (!submission || isFailedVepSubmission(submission)) {
    return <VepSubmissionError type="missing-submission" />;
  } else if (areVepSubmissionResultsExpired(submission)) {
    return <VepSubmissionError type="expired-submission" />;
  } else if (isLoading) {
    // fetching data for the first time
    return (
      <div className={styles.fullPageSpinnerContainer}>
        <CircleLoader />
      </div>
    );
  } else if (!vepResults || isError) {
    return <VepSubmissionError type="generic-error" />;
  }

  const {
    metadata: { pagination: paginationMetadata, filters: filterMetadata }
  } = vepResults;
  const resultsPanels = vepResults.metadata.display_panels;
  const hasSelectedOptions = hasAnySelectedOption(
    resultsPanels,
    submission?.parameters ?? {}
  );
  const { per_page, total } = paginationMetadata;
  const maxPage = Math.ceil(total / per_page);
  const genomeIdForUrl =
    submission.species!.genome_tag ?? submission.species!.genome_id;

  // Filtered vs unfiltered counts for the "Showing X of Y" summary.
  const resultSummary = filterMetadata
    ? {
        filtered: filterMetadata.filtered_total,
        total: filterMetadata.unfiltered_total
      }
    : null;

  const afSources = (vepResults.metadata.available_af_sources ?? []).map(
    (source) => ({
      key: source.key,
      label: formatAfSourceLabel(source)
    })
  );
  const scoreFields = vepResults?.metadata.available_scores ?? [];
  // Which fields the query builder offers, and how each is presented. Absent on
  // a job pinned before the catalogue existed, which then offers no filters.
  const filterFields = vepResults?.metadata.filter_fields ?? [];

  return (
    <div className={styles.container}>
      <VepSubmissionHeader
        submission={submission}
        filtersString={appliedSerialized || undefined}
      />
      <div className={styles.resultsBox}>
        <VepResultsHeader
          submission={submission}
          page={page}
          maxPage={maxPage}
          onPageChange={onPageChange}
          perPage={perPage}
          onPerPageChange={setPerPage}
          isFiltersOpen={isFiltersOpen}
          onToggleFilters={() => setIsFiltersOpen((open) => !open)}
          onToggleAllDetails={toggleAllDetails}
          isExpansionPending={isExpansionPending}
          canExpandDetails={hasSelectedOptions}
        />
        {isFiltersOpen && (
          <VepResultsFilters
            conditions={draftFilters}
            onChange={setDraftFilters}
            onApply={applyFilters}
            onClear={clearFilters}
            isDirty={isFiltersDirty}
            hasAppliedFilters={hasAppliedFilters}
            resultSummary={resultSummary}
            filterFields={filterFields}
            afSources={afSources}
            scoreFields={scoreFields}
            appliedConditionIds={appliedConditionIds}
          />
        )}
        <div className={styles.tableViewportWrapper}>
          {isFetching && (
            <div className={styles.tableLoadingOverlay}>
              <CircleLoader className={styles.tableLoadingSpinner} />
            </div>
          )}
          <div className={styles.tableViewport}>
            <VepResultsTable
              genomeId={genomeIdForUrl}
              variants={vepResults.variants}
              parameters={submission.parameters}
              hasSelectedOptions={hasSelectedOptions}
              panels={resultsPanels}
              display={vepResults.metadata.display}
              availableAfSources={
                vepResults.metadata.available_af_sources ?? []
              }
              detailExpansion={detailExpansion}
            />
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
  onPerPageChange,
  isFiltersOpen,
  onToggleFilters,
  onToggleAllDetails,
  isExpansionPending,
  canExpandDetails
}: {
  submission: VepSubmissionWithoutInputFile;
  page: number;
  perPage: number;
  maxPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (page: number) => void;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
  onToggleAllDetails: () => void;
  isExpansionPending: boolean;
  canExpandDetails: boolean; // False when the job ran no annotation option
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
        className={styles.speciesName}
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
      {canExpandDetails && (
        <ExpandAllAnnotationsToggle
          isPending={isExpansionPending}
          onClick={onToggleAllDetails}
        />
      )}
      <div>
        <ShowHide
          className={styles.filtersToggle}
          onClick={onToggleFilters}
          isExpanded={isFiltersOpen}
          label="Filters"
        />
      </div>
    </div>
  );
};

const ExpandAllAnnotationsToggle = ({
  isPending,
  onClick
}: {
  isPending: boolean;
  onClick: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (isPending) {
      return;
    }
    setIsExpanded(!isExpanded);
    onClick();
  };

  return (
    <div className={styles.expandAllToggleWrapper}>
      <TextButton
        className={styles.expandAllToggle}
        aria-pressed={isExpanded}
        aria-busy={isPending}
        onClick={handleClick}
        disabled={isPending}
      >
        {isExpanded ? 'Collapse all' : 'Expand all'}
      </TextButton>
      {isPending && (
        <CircleLoader size="small" className={styles.expandAllSpinner} />
      )}
    </div>
  );
};

const VepResultsTable = (props: {
  variants: VepResultsResponse['variants'];
  genomeId: string;
  parameters: Record<string, unknown>;
  panels: FormPanel[];
  display: DisplaySpec;
  availableAfSources: AfSource[];
  detailExpansion: DetailExpansion;
  hasSelectedOptions: boolean;
}) => {
  const {
    variants,
    genomeId,
    parameters,
    panels,
    display,
    availableAfSources,
    detailExpansion,
    hasSelectedOptions
  } = props;

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
          <ColumnHead>Annotations</ColumnHead>
        </tr>
      </thead>
      <tbody>
        {/* Use something more reliable for key than index */}
        {variants.map((variant, index) => (
          <MemoizedVariantRow
            variant={variant}
            genomeId={genomeId}
            parameters={parameters}
            hasSelectedOptions={hasSelectedOptions}
            panels={panels}
            display={display}
            availableAfSources={availableAfSources}
            detailExpansion={detailExpansion}
            key={index}
          />
        ))}
      </tbody>
    </Table>
  );
};

const TABLE_COLUMN_COUNT = 8;

const DETAIL_PANEL_COLSPAN = TABLE_COLUMN_COUNT;

// The variant/allele/gene "leading" cell to emit on a given row, together with
// the rowSpan it should carry.
type LeadingCells = {
  variant: {
    data: NonNullable<VepResultsTableRowData['variant']>;
    rowSpan: number;
  } | null;
  allele: {
    data: NonNullable<VepResultsTableRowData['alternativeAllele']>;
    rowSpan: number;
  } | null;
  gene: {
    data: NonNullable<VepResultsTableRowData['gene']>;
    rowSpan: number;
  } | null;
};

const toRowSpanAttr = (rowSpan: number) => (rowSpan > 1 ? rowSpan : undefined);

export const hasAnySelectedOption = (
  panels: FormPanel[] | undefined,
  parameters: Record<string, unknown>
): boolean =>
  !panels ||
  panels.some((panel) =>
    panel.options.some((option) => Boolean(parameters[option.id]))
  );

export const detailBearingRowIndices = (
  rows: VepResultsTableRowData[],
  hasAllele: (sequence: string) => boolean
): number[] => {
  const indices: number[] = [];
  rows.forEach((row, index) => {
    const alleleSequence =
      row.consequence.feature_type === 'transcript'
        ? row.consequence.altAlleleSequence
        : row.alternativeAllele?.allele_sequence;
    if (alleleSequence && hasAllele(alleleSequence)) {
      indices.push(index);
    }
  });
  return indices;
};

const splitIntoRuns = (
  start: number,
  span: number,
  expandedDetailRows: Set<number>
): { rowIndex: number; rowSpan: number }[] => {
  const end = start + span - 1;
  const runs: { rowIndex: number; rowSpan: number }[] = [];
  let runStart = start;
  for (let row = start; row <= end; row++) {
    if ((expandedDetailRows.has(row) && row < end) || row === end) {
      runs.push({ rowIndex: runStart, rowSpan: row - runStart + 1 });
      runStart = row + 1;
    }
  }
  return runs;
};

export const planLeadingCells = (
  rows: VepResultsTableRowData[],
  expandedDetailRows: Set<number>
): LeadingCells[] => {
  const plan: LeadingCells[] = rows.map(() => ({
    variant: null,
    allele: null,
    gene: null
  }));

  rows.forEach((row, index) => {
    if (row.variant) {
      const data = row.variant;
      for (const run of splitIntoRuns(
        index,
        data.rowspan,
        expandedDetailRows
      )) {
        plan[run.rowIndex].variant = { data, rowSpan: run.rowSpan };
      }
    }
    if (row.alternativeAllele) {
      const data = row.alternativeAllele;
      for (const run of splitIntoRuns(
        index,
        data.rowspan,
        expandedDetailRows
      )) {
        plan[run.rowIndex].allele = { data, rowSpan: run.rowSpan };
      }
    }
    if (row.gene) {
      const data = row.gene;
      for (const run of splitIntoRuns(
        index,
        data.rowspan,
        expandedDetailRows
      )) {
        plan[run.rowIndex].gene = { data, rowSpan: run.rowSpan };
      }
    }
  });

  return plan;
};

const VariantRow = (props: {
  variant: VepResultsResponse['variants'][number];
  genomeId: string;
  parameters: Record<string, unknown>;
  panels: FormPanel[];
  display: DisplaySpec;
  availableAfSources: AfSource[];
  detailExpansion: DetailExpansion;
  hasSelectedOptions: boolean;
}) => {
  const {
    genomeId,
    variant,
    parameters,
    panels,
    display,
    availableAfSources,
    detailExpansion,
    hasSelectedOptions
  } = props;
  const [expandedTranscriptPaths, setExpandedTranscriptPaths] = useState<
    ExpandedTranscriptsPath[]
  >([]);
  const [expandedDetailRows, setExpandedDetailRows] = useState<Set<number>>(
    new Set()
  );

  const allelesBySequence = useMemo(
    () =>
      new Map(
        variant.alternative_alleles.map((allele) => [
          allele.allele_sequence,
          allele
        ])
      ),
    [variant]
  );

  const tabularData = useVepVariantTabularData({
    variant,
    expandedTranscriptPaths
  });

  const detailRowIndices = useMemo(
    () =>
      detailBearingRowIndices(tabularData, (sequence) =>
        allelesBySequence.has(sequence)
      ),
    [tabularData, allelesBySequence]
  );

  const [appliedExpansion, setAppliedExpansion] = useState({
    expansion: detailExpansion,
    variant
  });
  if (
    appliedExpansion.expansion !== detailExpansion ||
    appliedExpansion.variant !== variant
  ) {
    setAppliedExpansion({ expansion: detailExpansion, variant });
    setExpandedDetailRows(
      detailExpansion.action === 'expand'
        ? new Set(detailRowIndices)
        : new Set()
    );
  }

  const toggleDetail = (rowIndex: number) => {
    setExpandedDetailRows((current) => {
      const next = new Set(current);
      if (next.has(rowIndex)) {
        next.delete(rowIndex);
      } else {
        next.add(rowIndex);
      }
      return next;
    });
  };

  const leadingCells = useMemo(
    () => planLeadingCells(tabularData, expandedDetailRows),
    [tabularData, expandedDetailRows]
  );

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

  return tabularData.map((row, index) => {
    const transcriptConsequence =
      row.consequence.feature_type === 'transcript' ? row.consequence : null;
    const isDetailOpen = expandedDetailRows.has(index);
    // The allele this row belongs to: from the transcript consequence, or (for
    // an intergenic row) from the row's alt-allele cell.
    const alleleSequence =
      transcriptConsequence?.altAlleleSequence ??
      row.alternativeAllele?.allele_sequence;
    const allele = alleleSequence
      ? allelesBySequence.get(alleleSequence)
      : undefined;

    const hasDetail = Boolean(allele) && hasSelectedOptions;

    const protvarUrl = buildProtvarUrlFromHgvsg(
      getAnnotation<HgvsgRepresentation>(allele, 'hgvsg')?.genomic
    );

    const openTargetsVariantId = buildOpenTargetsVariantId(
      variant,
      allele?.allele_sequence
    );

    const {
      variant: variantCell,
      allele: alleleCell,
      gene: geneCell
    } = leadingCells[index];

    return (
      <Fragment key={index}>
        <tr>
          {variantCell && (
            <>
              <td rowSpan={toRowSpanAttr(variantCell.rowSpan)}>
                <VariantName variant={variantCell.data} />
              </td>
              <td rowSpan={toRowSpanAttr(variantCell.rowSpan)}>
                <VepResultsAllele sequence={variantCell.data.referenceAllele} />
              </td>
              <td rowSpan={toRowSpanAttr(variantCell.rowSpan)}>
                <VepResultsLocation
                  genomeId={genomeId}
                  location={variantCell.data.location}
                />
              </td>
            </>
          )}
          {alleleCell && (
            <td rowSpan={toRowSpanAttr(alleleCell.rowSpan)}>
              <VepResultsAllele
                sequence={alleleCell.data.allele_sequence}
                structuralVariantDetail={
                  alleleCell.data.structural_variant_detail
                }
              />
            </td>
          )}
          <GeneTableCell row={row} geneCell={geneCell} genomeId={genomeId} />
          <TranscriptTableCell
            genomeId={genomeId}
            row={row}
            expandedTranscriptPaths={expandedTranscriptPaths}
            toggleExpanded={toggleExpandedTranscripts}
          />
          <td>
            <VariantConsequences consequences={row.consequence.consequences} />
          </td>
          <td>
            {hasDetail && (
              <ShowHide
                label={isDetailOpen ? 'Hide' : 'Show'}
                isExpanded={isDetailOpen}
                aria-expanded={isDetailOpen}
                aria-label={
                  isDetailOpen ? 'Hide annotations' : 'Show annotations'
                }
                onClick={() => toggleDetail(index)}
              />
            )}
          </td>
        </tr>
        {hasDetail && isDetailOpen && (
          <tr>
            <td colSpan={DETAIL_PANEL_COLSPAN} className={styles.detailCell}>
              <VepResultsAnnotationDetail
                genomeId={genomeId}
                consequence={row.consequence}
                allele={allele}
                parameters={parameters}
                panels={panels}
                display={display}
                availableAfSources={availableAfSources}
                protvarUrl={protvarUrl}
                openTargetsVariantId={openTargetsVariantId}
                onCollapse={() => toggleDetail(index)}
              />
            </td>
          </tr>
        )}
      </Fragment>
    );
  });
};

// Surprisingly, memoising the VariantRow component
// was crucial for making useTransition work for better responsiveness of ExpandAllAnnotationsToggle
// (before memoization, table rows re-rendered with the same priority as the toggle, which slowed down its update)
const MemoizedVariantRow = memo(VariantRow);

const GeneTableCell = (props: {
  row: VepResultsTableRowData;
  geneCell: LeadingCells['gene'];
  genomeId: string;
}) => {
  const { row, geneCell, genomeId } = props;

  if (geneCell) {
    return (
      <td rowSpan={toRowSpanAttr(geneCell.rowSpan)}>
        <VepResultsGene {...geneCell.data} genomeId={genomeId} />
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
  genomeId: string;
  row: VepResultsTableRowData;
  expandedTranscriptPaths: ExpandedTranscriptsPath[];
  toggleExpanded: (
    altAllele: string,
    geneId: string,
    action: 'expand' | 'collapse'
  ) => void;
}) => {
  const { genomeId, row, expandedTranscriptPaths, toggleExpanded } = props;

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
      <VepResultsTranscript genomeId={genomeId} transcript={row.consequence} />
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

const VariantConsequences = ({ consequences }: { consequences: string[] }) => {
  return consequences.map((consequence) => (
    <div key={consequence}>
      <VariantConsequence consequence={consequence} />
    </div>
  ));
};

export default VepSubmissionResults;
