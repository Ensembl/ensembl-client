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

import { Row, CategoryBlock, withOptionHelp } from './annotationRows';
import { renderDisplayOption } from './displaySpecRenderer';

import type {
  PredictedTranscriptConsequence,
  PredictedMolecularConsequence,
  AlternativeVariantAllele,
  AfSource
} from 'src/content/app/tools/vep/types/vepResultsResponse';
import type {
  FormPanel,
  FormPanelOption
} from 'src/content/app/tools/vep/types/vepFormConfig';
import type { DisplaySpec } from 'src/content/app/tools/vep/types/vepDisplaySpec';
import { groupByCategory } from 'src/content/app/tools/vep/utils/groupByCategory';
import { subOptionRan as didSubOptionRun } from 'src/content/app/tools/vep/utils/subOptionRan';
import { getOptionHelp } from 'src/content/app/tools/vep/views/vep-form/vep-form-options-section/vep-form-options-panel/optionHelp';
import styles from './VepResultsAnnotationDetail.module.css';

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

  // The same list, in the shape a `map_rows` block draws its rows from. The
  // display spec cannot name these: which populations a job carries is chosen
  // per submission, and their labels are decoded by the backend.
  const vocabularies = useMemo(
    () => ({
      af_populations: (availableAfSources ?? []).map((af) => ({
        scope: af.source,
        code: af.population,
        label: af.label
      }))
    }),
    [availableAfSources]
  );

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
      help: helpFor(optionId),
      vocabularies
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
            {group.category ? (
              <CategoryBlock label={group.category}>
                {group.nodes}
              </CategoryBlock>
            ) : (
              // A panel whose options carry no category: they are the section's
              // own content, so they stay flush with its heading.
              group.nodes
            )}
          </Fragment>
        ))}
      </Section>
    );
  };

  const renderedSections: { id: string; node: ReactNode }[] = (panels ?? [])
    .map((panel) => ({ id: panel.id, node: renderPanel(panel) }))
    .filter((section): section is { id: string; node: ReactNode } =>
      Boolean(section.node)
    );

  const columned = renderedSections.filter(
    (section) => section.id !== FULL_WIDTH_PANEL_ID
  );
  const fullWidth = renderedSections.filter(
    (section) => section.id === FULL_WIDTH_PANEL_ID
  );

  return (
    <div className={styles.detail}>
      {((panels && parameters) || onCollapse) && (
        <div className={styles.detailToolbar}>
          {panels && parameters && (
            <CheckboxWithLabel
              className={styles.showAllToggle}
              label="Show all"
              checked={showAll}
              onChange={setShowAll}
            />
          )}
          {onCollapse && (
            <CloseButton
              className={styles.toolbarClose}
              aria-label="Hide annotations"
              onClick={onCollapse}
            />
          )}
        </div>
      )}

      {/* Sections are rendered once, up front, so the count below is of the
          sections that actually survived rather than of the panels that might
          have produced one. */}
      <div className={styles.sections}>
        {columned.map((section) => (
          <Fragment key={section.id}>{section.node}</Fragment>
        ))}
      </div>

      {fullWidth.length > 0 && (
        <div className={styles.fullWidthSections}>
          {fullWidth.map((section) => (
            <Fragment key={section.id}>{section.node}</Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

const FULL_WIDTH_PANEL_ID = 'phenotype_and_disease_associations';

const Section = (props: { title: ReactNode; children: ReactNode }) => (
  <div className={styles.section}>
    <div className={styles.sectionTitle}>{props.title}</div>
    <div className={styles.sectionBody}>{props.children}</div>
  </div>
);

export default VepResultsAnnotationDetail;
