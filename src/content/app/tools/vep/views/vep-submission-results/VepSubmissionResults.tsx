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
  useRef,
  Fragment,
  type ChangeEvent
} from 'react';
import { useParams } from 'react-router';

import config from 'config';

import { useAppSelector, useAppDispatch } from 'src/store';
import useVepResultsPagination, {
  PER_PAGE_OPTIONS
} from './hooks/useVepResultsPagination';

import {
  getVepSubmissionsRestoredFlag,
  getVepSubmissionById
} from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSelectors';

import {
  useVepResultsQuery,
  useVepFormConfigQuery
} from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';
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
import { getAnnotation } from 'src/content/app/tools/vep/utils/annotations';
import { resolveResultsPanels } from 'src/content/app/tools/vep/utils/resultsPanels';
import {
  transcriptFeatureExplorerUrl,
  openInNewTab
} from 'src/content/app/tools/vep/utils/featureExplorerUrls';
import ViewInAppPopup from 'src/shared/components/view-in-app-popup/ViewInAppPopup';

import VepSubmissionHeader from 'src/content/app/tools/vep/components/vep-submission-header/VepSubmissionHeader';
import VepInputSummary from 'src/content/app/tools/vep/components/vep-input-summary/VepInputSummary';
import { Table, ColumnHead } from 'src/shared/components/table';
import VariantConsequence from 'src/shared/components/variant-consequence/VariantConsequence';
import VepResultsGene from './components/vep-results-gene/VepResultsGene';
import VepResultsLocation from './components/vep-results-location/VepResultsLocation';
import VepResultsAllele from './components/vep-results-allele/VepResultsAllele';
import VepResultsAnnotationDetail from './components/vep-results-annotation-detail/VepResultsAnnotationDetail';
import VepResultsFilters from './components/vep-results-filters/VepResultsFilters';
import { getTranscriptGroupOptions } from './components/vep-results-filters/resultsFilterFields';

import Chevron from 'src/shared/components/chevron/Chevron';
import Pill from 'src/shared/components/pill/Pill';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import SpeciesName from 'src/shared/components/species-name/SpeciesName';
import Pagination from 'src/shared/components/pagination/Pagination';
import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import { CircleLoader } from 'src/shared/components/loader';
import VepSubmissionError from 'src/content/app/tools/vep/components/missing-vep-submission-error/VepSubmissionError';

import type { VepSubmissionWithoutInputFile } from 'src/content/app/tools/vep/types/vepSubmission';
import type {
  VepResultsResponse,
  AfSource
} from 'src/content/app/tools/vep/types/vepResultsResponse';
import type { FormPanel } from 'src/content/app/tools/vep/types/vepFormConfig';
import type { DisplaySpec } from 'src/content/app/tools/vep/types/vepDisplaySpec';
import {
  serializeResultsFilters,
  type ResultsFilterCondition
} from 'src/content/app/tools/vep/types/vepResultsFilters';

import styles from './VepSubmissionResults.module.css';

type RestoredVepSubmission = Omit<VepSubmissionWithoutInputFile, 'species'> & {
  species: NonNullable<VepSubmissionWithoutInputFile['species']>;
};

const AF_SOURCE_LABELS: Record<string, string> = {
  gnomad_exomes: 'gnomAD exomes',
  gnomad_genomes: 'gnomAD genomes',
  all_of_us: 'All of Us',
  gnomad_sv: 'gnomAD SV',
  gnomad_cnv: 'gnomAD CNV'
};

// A friendly label for an AF source, combining the source name with the
// population label the backend already decoded. Empty population = the source's
// overall AF.
const formatAfSourceLabel = (source: AfSource): string => {
  const base = AF_SOURCE_LABELS[source.source] ?? source.source;
  return source.population ? `${base} — ${source.label}` : `${base} (overall)`;
};

/**
 * TODO:
 * - Add unique id to variants after they are requested (to use for keys)
 */

// A page-level command to open or close every annotation-detail panel at once.
// `nonce` changes on each click so a VariantRow re-applies the action even after
// individual rows were toggled; `action` is the last bulk choice (also the
// button label). Deliberately scoped to the top-level transcript / intergenic
// rows already in the table — it never expands the hidden transcripts, whose
// annotations could be a lot to render at once.
type DetailExpansion = {
  action: 'expand' | 'collapse';
  nonce: number;
};

const VepSubmissionResults = () => {
  const { submissionId } = useParams() as { submissionId: string };
  const { page, perPage, setPage, setPerPage } = useVepResultsPagination();

  // Filter state: `draftFilters` is what the query builder is editing;
  // `appliedFilters` is what actually drives the (server-side) request, committed
  // on Apply. Each apply is a full scan, so we don't refetch on every keystroke.
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<ResultsFilterCondition[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<ResultsFilterCondition[]>(
    []
  );

  // Bulk expand / collapse of every annotation-detail panel (see DetailExpansion).
  const [detailExpansion, setDetailExpansion] = useState<DetailExpansion>({
    action: 'collapse',
    nonce: 0
  });
  const toggleAllDetails = () =>
    setDetailExpansion((prev) => ({
      action: prev.action === 'expand' ? 'collapse' : 'expand',
      nonce: prev.nonce + 1
    }));

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

  // Download links restricted to the rows passing the applied filters — they
  // carry the same `filters` payload the results request uses. The header's own
  // Download button is deliberately left untouched (it always downloads the whole
  // result set); this filtered download lives in the filters panel and is
  // disabled until filters are applied.
  const filteredDownload = useMemo(() => {
    const base = `${config.toolsApiBaseUrl}/vep/submissions/${submissionId}/download`;
    const filtersParam = appliedSerialized
      ? `&filters=${encodeURIComponent(appliedSerialized)}`
      : '';
    return {
      vcfHref: `${base}?format=vcf${filtersParam}`,
      tableHref: `${base}?format=tsv${filtersParam}`
    };
  }, [submissionId, appliedSerialized]);

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

  // The `panels` define the annotation hierarchy (the same contract used by the
  // input form); the results detail arranges its output by them. Jobs submitted
  // since panels became pinned carry their own on the results response
  // (`metadata.display_panels`) — the options they actually ran with. The live
  // form_config query is only the fallback for jobs submitted before that, and
  // is skipped once a pinned set is available.
  const species = submission?.species;
  const pinnedPanels = vepResults?.metadata.display_panels ?? null;
  const { currentData: formConfig } = useVepFormConfigQuery(
    {
      genome_id: species?.genome_id ?? '',
      species_taxonomy_id: species?.species_taxonomy_id,
      assembly_name: species?.assembly.name
    },
    // Wait for the results before deciding: a job with pinned panels needs no
    // form_config request at all, and one without gets it as soon as we know.
    { skip: !species?.genome_id || !vepResults || !!pinnedPanels }
  );
  const resultsPanels = resolveResultsPanels({
    pinnedPanels,
    livePanels: formConfig?.panels
  });

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
  const { per_page, total } = paginationMetadata;
  const maxPage = Math.ceil(total / per_page);
  // Ensembl URLs use the genome UUID; the human-readable tag (e.g. `grch38`) is
  // being retired.
  const genomeIdForUrl = (submission as RestoredVepSubmission).species.genome_id;

  // Filtered vs unfiltered counts for the "Showing X of Y" summary.
  const resultSummary = filterMetadata
    ? {
        filtered: filterMetadata.filtered_total,
        total: filterMetadata.unfiltered_total
      }
    : null;

  // Transcript-group choices depend on the species: human GRCh38 has the MANE
  // sets, everything else has canonical only. Mirror the backend's check
  // (form_panels.is_human_grch38): taxonomy 9606 + assembly name starting
  // "GRCh38" (the name may carry a patch suffix, e.g. "GRCh38.p14").
  const isHumanGRCh38 =
    String(submission.species?.species_taxonomy_id) === '9606' &&
    (submission.species?.assembly.name ?? '').startsWith('GRCh38');
  const transcriptGroupOptions = getTranscriptGroupOptions(isHumanGRCh38);

  // Allele-frequency filter options: the AF columns present in this result set
  // (i.e. the AF options chosen at input), labelled with the same source /
  // population names used elsewhere in the UI.
  const afSources = (vepResults.metadata.available_af_sources ?? []).map(
    (source) => ({
      key: source.key,
      label: formatAfSourceLabel(source)
    })
  );

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
          isFiltersOpen={isFiltersOpen}
          onToggleFilters={() => setIsFiltersOpen((open) => !open)}
          allDetailsExpanded={detailExpansion.action === 'expand'}
          onToggleAllDetails={toggleAllDetails}
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
            transcriptGroupOptions={transcriptGroupOptions}
            afSources={afSources}
            appliedConditionIds={appliedConditionIds}
            filteredDownload={filteredDownload}
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
              panels={resultsPanels}
              display={vepResults.metadata.display}
              availableAfSources={vepResults.metadata.available_af_sources ?? []}
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
  allDetailsExpanded,
  onToggleAllDetails
}: {
  submission: VepSubmissionWithoutInputFile;
  page: number;
  perPage: number;
  maxPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (page: number) => void;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
  allDetailsExpanded: boolean;
  onToggleAllDetails: () => void;
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
      <button
        type="button"
        className={styles.expandAllToggle}
        aria-pressed={allDetailsExpanded}
        onClick={onToggleAllDetails}
      >
        {allDetailsExpanded ? 'Collapse all' : 'Expand all'}
      </button>
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

const VepResultsTable = (props: {
  variants: VepResultsResponse['variants'];
  genomeId: string;
  parameters: Record<string, unknown>;
  panels: FormPanel[] | undefined;
  display: DisplaySpec | null | undefined;
  availableAfSources: AfSource[];
  detailExpansion: DetailExpansion;
}) => {
  const {
    variants,
    genomeId,
    parameters,
    panels,
    display,
    availableAfSources,
    detailExpansion
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
          <VariantRow
            variant={variant}
            genomeId={genomeId}
            parameters={parameters}
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

// The expanded annotation panel is right-aligned: it occupies the right-hand
// columns (Genes → Annotations), while the variant-identity columns (Variant,
// Ref, Location, Alt allele) continue to its left. That identity block is
// IDENTITY_COLUMN_COUNT wide, so the panel spans the remaining columns.
const IDENTITY_COLUMN_COUNT = 4;
const DETAIL_PANEL_COLSPAN = TABLE_COLUMN_COUNT - IDENTITY_COLUMN_COUNT;

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

// The indices of the rows that have an annotation detail to open: a row whose
// allele carries annotations. The allele comes from the transcript consequence,
// or (for an intergenic row) the row's own alt-allele marker — the same rule
// `hasDetail` uses per row when deciding whether to draw the toggle chevron.
// These are exactly the rows the "Expand all" control opens: the current table
// rows (the top-level transcript per gene plus intergenic rows), never the
// collapsed transcripts.
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

// Split a gene's rowSpan group (covering `span` consecutive content rows from
// `start`) into the runs that survive once expanded detail panels are injected.
// The gene column is the panel's first column, so a gene cell can never cover a
// detail row: an expanded row that is not the group's last ends its run (the
// panel goes below it) and a fresh gene cell starts on the row after. A run
// never contains a detail row, so its rowSpan equals its content-row count.
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

// Plan which leading cells each row emits and with what rowSpan, given the set
// of expanded detail rows. The variant and allele cells sit left of the
// right-aligned panel, so they span straight through any detail rows in their
// group (a single cell, no repeat); the gene cell is the panel's first column,
// so it restarts below any panel that interrupts its group.
export const planLeadingCells = (
  rows: VepResultsTableRowData[],
  expandedDetailRows: Set<number>
): LeadingCells[] => {
  const plan: LeadingCells[] = rows.map(() => ({
    variant: null,
    allele: null,
    gene: null
  }));

  // Content rows in [start, start + span) that carry an expanded detail panel:
  // the variant/allele cells must count these to span past the injected rows.
  const detailsInSpan = (start: number, span: number) => {
    let count = 0;
    for (let row = start; row < start + span; row++) {
      if (expandedDetailRows.has(row)) {
        count++;
      }
    }
    return count;
  };

  rows.forEach((row, index) => {
    if (row.variant) {
      const data = row.variant;
      plan[index].variant = {
        data,
        rowSpan: data.rowspan + detailsInSpan(index, data.rowspan)
      };
    }
    if (row.alternativeAllele) {
      const data = row.alternativeAllele;
      plan[index].allele = {
        data,
        rowSpan: data.rowspan + detailsInSpan(index, data.rowspan)
      };
    }
    if (row.gene) {
      const data = row.gene;
      for (const run of splitIntoRuns(index, data.rowspan, expandedDetailRows)) {
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
  panels: FormPanel[] | undefined;
  display: DisplaySpec | null | undefined;
  availableAfSources: AfSource[];
  detailExpansion: DetailExpansion;
}) => {
  const {
    genomeId,
    variant,
    parameters,
    panels,
    display,
    availableAfSources,
    detailExpansion
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

  // The rows the "Expand all" control opens for this variant (see
  // detailBearingRowIndices).
  const detailRowIndices = useMemo(
    () =>
      detailBearingRowIndices(tabularData, (sequence) =>
        allelesBySequence.has(sequence)
      ),
    [tabularData, allelesBySequence]
  );

  // Apply the page-level bulk expand / collapse. Read the current detail rows
  // through a ref so this reacts only to the control (`detailExpansion`) and to
  // the variant changing (pagination) — not to the user separately expanding
  // transcripts, which grows `tabularData` but should leave open panels alone.
  const detailRowIndicesRef = useRef(detailRowIndices);
  detailRowIndicesRef.current = detailRowIndices;
  useEffect(() => {
    setExpandedDetailRows(
      detailExpansion.action === 'expand'
        ? new Set(detailRowIndicesRef.current)
        : new Set()
    );
  }, [detailExpansion, variant]);

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

  // An expanded detail is rendered as a right-aligned <td colSpan> row inserted
  // right after its transcript row: it occupies the columns from Genes across,
  // while the variant/allele identity cells span down its left side.
  // `planLeadingCells` computes how each of those leading cells spans past (or
  // restarts around) the injected detail rows.
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
    // The annotation detail is available for any consequence that has an allele
    // with annotations — including intergenic variants (SPDI, HGVSg, CADD,
    // frequencies…), which have no transcript row.
    const hasDetail = Boolean(allele);
    // ProtVar link for this allele, built from the allele's HGVSg — VEP's
    // canonical minimal representation, which is exactly what ProtVar expects.
    // (When ProtVar is selected the backend forces HGVSg to be computed.)
    const protvarUrl = buildProtvarUrlFromHgvsg(
      getAnnotation(allele, 'hgvsg')?.genomic
    );

    // The variant/allele/gene cells to emit on this row, already split so their
    // rowSpans never cover an expanded detail panel (see planLeadingCells).
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
              <button
                type="button"
                className={styles.detailToggle}
                aria-expanded={isDetailOpen}
                aria-label={isDetailOpen ? 'Hide annotations' : 'Show annotations'}
                onClick={() => toggleDetail(index)}
              >
                <Chevron
                  direction={isDetailOpen ? 'up' : 'down'}
                  animate={true}
                  className={styles.detailChevron}
                />
              </button>
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
                onCollapse={() => toggleDetail(index)}
              />
            </td>
          </tr>
        )}
      </Fragment>
    );
  });
};

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
      <VariantTranscript genomeId={genomeId} transcript={row.consequence} />
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
  genomeId: string;
  transcript: {
    stable_id: string;
    biotype: string;
    is_canonical: boolean;
    is_mane_select?: boolean;
    is_mane_plus_clinical?: boolean;
    is_gencode_primary?: boolean;
  };
}) => {
  const { genomeId, transcript } = props;
  // A transcript can carry several tags at once (e.g. MANE Select + GENCODE
  // primary + canonical); show all that apply. The order here is only the
  // left-to-right display order and mirrors the transcript-ranking hierarchy;
  // it does not suppress the lower tags. (MANE Select and MANE Plus Clinical
  // are mutually exclusive, so at most one MANE tag ever shows.)
  const badges = [
    transcript.is_mane_select && 'MANE Select',
    transcript.is_mane_plus_clinical && 'MANE Plus Clinical',
    transcript.is_gencode_primary && 'GENCODE Primary',
    transcript.is_canonical && 'Canonical'
  ].filter((badge): badge is string => Boolean(badge));

  return (
    <>
      <div>
        <ViewInAppPopup
          links={{
            entityViewer: openInNewTab(
              transcriptFeatureExplorerUrl(genomeId, transcript.stable_id)
            )
          }}
        >
          {transcript.stable_id}
        </ViewInAppPopup>
      </div>
      <div className={styles.smallLight}>{transcript.biotype}</div>
      {badges.length > 0 && (
        <div className={styles.transcriptBadges}>
          {badges.map((badge) => (
            <span key={badge} className={styles.transcriptBadge}>
              {badge}
            </span>
          ))}
        </div>
      )}
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
