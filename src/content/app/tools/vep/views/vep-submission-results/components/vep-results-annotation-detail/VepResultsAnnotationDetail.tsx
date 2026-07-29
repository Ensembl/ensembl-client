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

import { useState, useMemo, Fragment, type ReactNode } from 'react';

import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import { Row, OptionBlock, withOptionHelp } from './annotationRows';
import { renderDisplayOption } from './displaySpecRenderer';

import type {
  PredictedTranscriptConsequence,
  PredictedMolecularConsequence,
  AlternativeVariantAllele,
  PopulationFrequencies,
  GnomadStructuralData,
  AfSource
} from 'src/content/app/tools/vep/types/vepResultsResponse';
import type {
  FormPanel,
  FormPanelOption
} from 'src/content/app/tools/vep/types/vepFormConfig';
import type { DisplaySpec } from 'src/content/app/tools/vep/types/vepDisplaySpec';
import { groupByCategory } from 'src/content/app/tools/vep/utils/groupByCategory';
import { getAnnotation } from 'src/content/app/tools/vep/utils/annotations';
import { subOptionRan as didSubOptionRun } from 'src/content/app/tools/vep/utils/subOptionRan';
import { getOptionHelp } from 'src/content/app/tools/vep/views/vep-form/vep-form-options-section/vep-form-options-panel/optionHelp';
import { num } from 'src/content/app/tools/vep/utils/annotationFormatters';
import styles from './VepResultsAnnotationDetail.module.css';

// The `source` value used in metadata.available_af_sources for each allele-
// frequency option id. Only All of Us differs (option `allofus` vs source
// `all_of_us`); used to key the population-label lookup and to list a no-data
// source's selected populations in Show all.
const AF_SOURCE_KEY_BY_OPTION: Record<string, string> = {
  gnomad_exomes: 'gnomad_exomes',
  gnomad_genomes: 'gnomad_genomes',
  allofus: 'all_of_us',
  gnomad_sv: 'gnomad_sv',
  gnomad_cnv: 'gnomad_cnv'
};

/**
 * The expandable detail panel for one transcript consequence.
 *
 * The arrangement of annotations follows the form_config `panels` hierarchy
 * (the same contract that drives the input form): each panel is a section, in
 * panel order, with options rendered in their defined order and grouped by
 * their `category`. This keeps inputs and outputs consistent.
 *
 * Two modes: the default view shows only annotations that returned a value;
 * "Show all" shows every option that was run for the submission (from its
 * parameters), with a dash where no value was returned.
 */
const VepResultsAnnotationDetail = (props: {
  genomeId: string;
  consequence: PredictedMolecularConsequence;
  allele: AlternativeVariantAllele | undefined;
  parameters?: Record<string, unknown>;
  panels?: FormPanel[];
  /**
   * How the spec-driven options lay out, from the spec pinned to this job
   * (`metadata.display`). Absent only for a response with no display section at
   * all, in which case those options render nothing rather than wrongly.
   */
  display?: DisplaySpec | null;
  /**
   * The AF columns this job ran with (`metadata.available_af_sources`), used in
   * Show all to list each selected population of a source that returned no data.
   */
  availableAfSources?: AfSource[];
  protvarUrl?: string;
  /** This variant in OpenTargets' notation, for the link in its block. */
  openTargetsVariantId?: string;
  /** Collapse this detail (wired to the row's expand toggle). */
  onCollapse?: () => void;
}) => {
  const {
    genomeId,
    consequence,
    allele,
    parameters,
    panels,
    display,
    availableAfSources,
    protvarUrl,
    openTargetsVariantId,
    onCollapse
  } = props;
  const [showAll, setShowAll] = useState(false);

  // Population labels for the AF breakdown come from the backend, keyed by
  // `${source}|${population}` (the same selected columns each variant's
  // populations are drawn from). `populationLabel` falls back to the raw code for
  // anything not in the set (e.g. an older job without labelled sources).
  const afLabelByCode = useMemo(() => {
    const map = new Map<string, string>();
    for (const af of availableAfSources ?? []) {
      map.set(`${af.source}|${af.population}`, af.label);
    }
    return map;
  }, [availableAfSources]);
  const populationLabel = (sourceKey: string, code: string) =>
    afLabelByCode.get(`${sourceKey}|${code}`) ?? code;

  const optionRan = (optionId: string) => Boolean(parameters?.[optionId]);

  /**
   * The help text for an option, as shown on the form — looked up through the
   * pinned `panels` because `getOptionHelp` resolves `{version}` and any
   * version-specific link from the option's *label*, which is per-assembly
   * (gnomAD SV is v4.1 on GRCh38, v2.1 on GRCh37).
   *
   * No panels (older jobs, and some callers pass none) simply means no help,
   * and every heading renders exactly as it did before.
   */
  const optionsById = useMemo(() => {
    const map = new Map<string, FormPanelOption>();
    for (const panel of panels ?? []) {
      for (const option of panel.options) {
        map.set(option.id, option);
      }
    }
    return map;
  }, [panels]);
  const helpFor = (optionId: string) => {
    const option = optionsById.get(optionId);
    return option ? getOptionHelp(option) : undefined;
  };

  // Whether a sub-option ran (default-aware — see subOptionRan util). Any option
  // with multiple sub-options should, in Show all, list its run sub-options via
  // this helper (value or dash) — see ProtVar / mutfunc / IntAct below; apply the
  // same pattern to future options that have sub-options.
  const subOptionRan = (optionId: string, defaultValue: boolean) =>
    didSubOptionRun(parameters, optionId, defaultValue);

  // Content (value node) for a single option, or null when this
  // transcript/allele has no value for it. Every option is now described by the
  // annotation spec's `display` section and rendered generically — there is no
  // remaining override registry (options with no `display` entry, e.g. geno2mp
  // / tss_distance, simply render nothing).
  const optionContent = (optionId: string): ReactNode | null => {
    const specOption = display?.options.find(
      (option) => option.option_id === optionId
    );
    if (!specOption || !display) {
      return null;
    }
    return renderDisplayOption({
      option: specOption,
      spec: display,
      // Allele-level options (SPDI, HGVSg, CADD, …) read from the allele; the
      // rest from this transcript consequence — the choice comes from the spec's
      // `plugin_scopes`. The cast is only to reach transcript-typed fields a link
      // builder needs (the protein gene); intergenic consequences lack them and
      // fall back gracefully.
      consequence: consequence as PredictedTranscriptConsequence,
      allele,
      showAll,
      subOptionRan,
      // For named link builders (ProtVar's icon, the protein "View in" popup).
      genomeId,
      protvarUrl,
      openTargetsVariantId,
      // Hung on whichever node turns out to be the option's visible title.
      help: helpFor(optionId)
    });
  };

  // Render one option: its value node, or (in Show all) a dash when the option
  // ran but returned nothing.
  //
  // Gate on selection first: an option's output is shown only if that option was
  // actually selected for the run. The response can carry annotation data for
  // options the user didn't pick — dev-data VCFs are annotated from a full cache,
  // so unselected columns (and thus their parsed annotations) are still present —
  // and without this gate they leak into the view (e.g. CADD showing when it was
  // never selected). Default-aware: an option left at a default-on value isn't
  // written to the submitted parameters, so treat "absent" as its default.
  const renderOption = (option: FormPanelOption): ReactNode | null => {
    // The HGVS control drives the `hgvs` param (HGVSc/HGVSp), which the single
    // `hgvs` display option renders under one "HGVS" heading.
    //
    // The `hgvsg` param is not reachable from this loop (it has no top-level
    // form option) and is currently hidden anyway — pending chromosome synonyms
    // it has no form control and no row in the annotation spec, and is computed
    // only because ProtVar forces it on. So HGVS surfaces on `hgvs` alone. (A
    // job submitted before this change renders against its own pinned display
    // spec, so it still shows the HGVSg row it was run with.)
    if (option.id === 'hgvs') {
      if (!optionRan('hgvs')) {
        return null; // not selected — hidden, as the generic gate would do
      }
      const content = optionContent('hgvs');
      if (content) {
        return <Fragment key="hgvs">{content}</Fragment>;
      }
      return showAll ? (
        <Row
          key="hgvs"
          label={withOptionHelp(option.label, helpFor('hgvs'))}
          value="—"
          emphasis
        />
      ) : null;
    }

    if (!didSubOptionRun(parameters, option.id, option.default)) {
      return null;
    }
    const content = optionContent(option.id);
    if (content) {
      return <Fragment key={option.id}>{content}</Fragment>;
    }
    if (showAll) {
      return (
        <Row
          key={option.id}
          label={withOptionHelp(option.label, helpFor(option.id))}
          value="—"
          emphasis
        />
      );
    }
    return null;
  };

  const renderPanel = (panel: FormPanel): ReactNode | null => {
    // Allele frequencies need their own renderer (a per-source population
    // breakdown, not the generic option rows), but they render *in the panel's
    // place* — the backend states one panel order for the form and these
    // annotations alike, and appending this block after the loop put it last
    // whatever that order said.
    if (panel.id === 'allele_frequencies') {
      return <Fragment key={panel.id}>{renderFrequencies()}</Fragment>;
    }
    const groups = groupByCategory(panel.options);
    const renderedGroups = groups
      .map((group) => ({
        category: group.category,
        nodes: group.options.map(renderOption).filter(Boolean)
      }))
      .filter((group) => group.nodes.length > 0);

    if (renderedGroups.length === 0) {
      return null;
    }
    return (
      <Section key={panel.id} title={panel.label}>
        {renderedGroups.map((group, index) => (
          <Fragment key={group.category ?? index}>
            {group.category && (
              <div className={styles.categoryLabel}>{group.category}</div>
            )}
            {group.nodes}
          </Fragment>
        ))}
      </Section>
    );
  };

  // The selected populations of an AF source that returned no data, each as a
  // dash ("—") row — shown in Show all so an empty source mirrors the population
  // breakdown a populated one gets, rather than collapsing to a single row. An
  // empty `population` is the source's overall AF (labelled "All", as in
  // FrequencyBlock). A source with no entries here falls back to a single dash
  // row.
  const noDataPopulationRows = (optionId: string): ReactNode[] => {
    const sourceKey = AF_SOURCE_KEY_BY_OPTION[optionId];
    if (!sourceKey) {
      return [];
    }
    return (availableAfSources ?? [])
      .filter((af) => af.source === sourceKey)
      .map((af) => <Row key={af.key} label={af.label} value="—" />);
  };

  // Allele frequencies. A selected source shows its
  // frequencies when this variant has them; a source with no data is hidden in
  // the default view and surfaced only in Show all (as a dash, broken down by the
  // selected populations — noDataPopulationRows), like every other option. The
  // whole section is dropped when nothing survives.
  const renderFrequencies = (): ReactNode | null => {
    const sources: {
      id: string;
      label: string;
      data: PopulationFrequencies | null;
    }[] = [
      {
        id: 'gnomad_exomes',
        label: 'gnomAD exomes',
        data: getAnnotation(allele, 'gnomad_exomes')
      },
      {
        id: 'gnomad_genomes',
        label: 'gnomAD genomes',
        data: getAnnotation(allele, 'gnomad_genomes')
      },
      {
        id: 'allofus',
        label: 'All of Us',
        data: getAnnotation(allele, 'all_of_us')
      }
    ];

    // Present when either the overall AF or any population survives — a job that
    // selected specific sub-populations (but not the all-ancestry overall) has a
    // null `overall` yet real population values, and must still show.
    const hasData = (data: PopulationFrequencies | null) =>
      data !== null &&
      (data.overall !== null || Object.keys(data.populations).length > 0);

    // Show a source only when its option was selected for the run — the same
    // selection gate every other option uses (renderOption), so an unselected
    // source can't leak in just because the full-cache VCF carried its column.
    // A selected source with no frequency for this variant shows a dash ("—").
    // (The AF options are all default-off, so a plain selection check suffices.)
    const visible = sources.filter((s) => optionRan(s.id));

    // gnomAD SV / CNV are structural AF sources with a different shape — a variant
    // id + type above the population frequencies — so they render via their own
    // block (below).
    const structuralSources: {
      id: string;
      label: string;
      data: GnomadStructuralData | null;
    }[] = [
      {
        id: 'gnomad_sv',
        label: 'gnomAD SV',
        data: getAnnotation(allele, 'gnomad_sv')
      },
      {
        id: 'gnomad_cnv',
        label: 'gnomAD CNV',
        data: getAnnotation(allele, 'gnomad_cnv')
      }
    ];
    const structuralVisible = structuralSources.filter((s) => optionRan(s.id));

    if (visible.length === 0 && structuralVisible.length === 0) {
      return null;
    }

    // A no-data source is hidden in the default view and shown only in Show all
    // (as dash rows), so it behaves like every other option.
    const renderNoData = (id: string, label: string): ReactNode => {
      if (!showAll) {
        return null;
      }
      const rows = noDataPopulationRows(id);
      const labelNode = withOptionHelp(label, helpFor(id));
      return rows.length > 0 ? (
        <OptionBlock key={id} label={labelNode}>
          {rows}
        </OptionBlock>
      ) : (
        <Row key={id} label={labelNode} value="—" emphasis />
      );
    };

    const renderStructural = (s: {
      id: string;
      label: string;
      data: GnomadStructuralData | null;
    }): ReactNode => {
      if (structuralHasData(s.data)) {
        return (
          <StructuralFrequencyBlock
            key={s.id}
            label={withOptionHelp(s.label, helpFor(s.id))}
            populationLabel={(code) => populationLabel(s.id, code)}
            data={s.data}
          />
        );
      }
      return renderNoData(s.id, s.label);
    };

    const renderFlat = (s: {
      id: string;
      label: string;
      data: PopulationFrequencies | null;
    }): ReactNode => {
      if (hasData(s.data)) {
        return (
          <FrequencyBlock
            key={s.id}
            label={withOptionHelp(s.label, helpFor(s.id))}
            populationLabel={(code) =>
              populationLabel(AF_SOURCE_KEY_BY_OPTION[s.id], code)
            }
            data={s.data}
          />
        );
      }
      return renderNoData(s.id, s.label);
    };

    const nodes = [
      ...visible.map(renderFlat),
      ...structuralVisible.map(renderStructural)
    ].filter(Boolean);

    // Every selected source had no data in the default view -> no section header.
    if (nodes.length === 0) {
      return null;
    }

    return <Section title="Allele frequencies">{nodes}</Section>;
  };

  return (
    <div className={styles.detail}>
      {/* The toolbar sits outside the multi-column section list: an interactive
          control inside a CSS multicol (as a column-span:all element) can have
          its clicks swallowed by an overlapping column, which broke "Show all". */}
      {panels && parameters && (
        <div className={styles.detailToolbar}>
          <CheckboxWithLabel
            label="Show all"
            checked={showAll}
            onChange={setShowAll}
          />
        </div>
      )}

      <div className={styles.sections}>
        {(panels ?? []).map(renderPanel)}
        {/* Older jobs pinned their panels before allele frequencies were one,
            and some callers pass no panels at all. Both still get the block —
            appended, as it always was. Only its position moves when the panel
            is there to place it. */}
        {!(panels ?? []).some((panel) => panel.id === 'allele_frequencies') &&
          renderFrequencies()}
      </div>

      {/* Collapse control at the bottom-right — the same blue close (cross) used
          at the bottom of an expanded transcript list — so a long panel can be
          closed without scrolling back to the row's expand chevron. */}
      {onCollapse && (
        <div className={styles.collapseRow}>
          <CloseButton aria-label="Hide annotations" onClick={onCollapse} />
        </div>
      )}
    </div>
  );
};

const Section = (props: { title: ReactNode; children: ReactNode }) => (
  <div className={styles.section}>
    <div className={styles.sectionTitle}>{props.title}</div>
    <div className={styles.sectionBody}>{props.children}</div>
  </div>
);

// One allele-frequency source (e.g. gnomAD genomes): the source name as a
// sub-heading (like SpliceAI), with the selected populations beneath it, each
// label-left / AF right-justified. `overall` is the all-populations figure.
const FrequencyBlock = (props: {
  label: ReactNode;
  populationLabel: (code: string) => string;
  data: PopulationFrequencies | null;
}) => {
  if (
    !props.data ||
    (props.data.overall === null &&
      Object.keys(props.data.populations).length === 0)
  ) {
    return null;
  }
  const maxSubpopulationLabel = props.data.max_subpopulation_label;
  return (
    <OptionBlock label={props.label}>
      {/* The all-ancestry "All" row only when its column was selected (the
          backend nulls `overall` otherwise); the per-population rows follow. */}
      {props.data.overall !== null && (
        <Row label="All" value={num(props.data.overall)} />
      )}
      {Object.entries(props.data.populations).map(([pop, value]) => {
        // The "max" AF (All of Us) names the subpopulation it came from; show it
        // in brackets, e.g. "0.000167 (European)" (label decoded by the backend).
        const bracket = pop === 'max' ? maxSubpopulationLabel : null;
        return (
          <Row
            key={pop}
            label={props.populationLabel(pop)}
            value={bracket ? `${num(value)} (${bracket})` : num(value)}
          />
        );
      })}
    </OptionBlock>
  );
};

// Present when the variant overlaps a gnomAD SV/CNV (the id survives) or carries
// any frequency for it.
const structuralHasData = (data: GnomadStructuralData | null): boolean =>
  data !== null &&
  (data.id !== null ||
    data.overall !== null ||
    Object.keys(data.populations).length > 0);

// A gnomAD SV / CNV source: the overlapping variant's id + type, then its
// overall / per-population frequencies (like FrequencyBlock, with two identity
// rows on top). `label` is the source name ("gnomAD SV" / "gnomAD CNV").
const StructuralFrequencyBlock = (props: {
  label: ReactNode;
  populationLabel: (code: string) => string;
  data: GnomadStructuralData | null;
}) => {
  if (!structuralHasData(props.data)) {
    return null;
  }
  const data = props.data as GnomadStructuralData;
  return (
    <OptionBlock label={props.label}>
      {data.id !== null && (
        <Row label="Structural variant" value={data.id} mono />
      )}
      {data.svtype !== null && <Row label="Type" value={data.svtype} />}
      {data.overall !== null && <Row label="All" value={num(data.overall)} />}
      {Object.entries(data.populations).map(([pop, value]) => (
        <Row key={pop} label={props.populationLabel(pop)} value={num(value)} />
      ))}
    </OptionBlock>
  );
};

export default VepResultsAnnotationDetail;
