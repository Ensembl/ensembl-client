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

import { useState, useEffect, useMemo, Fragment, type ReactNode } from 'react';

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

  // Build this panel's contents only once it is near the viewport.
  //
  // "Expand all" opens one of these per row, and at the default page size of
  // 100 that was ~14,000 DOM nodes in one go — but the greater cost is the
  // JavaScript, not the nodes: a trace of it is ~90% scripting, because every
  // panel walks the display spec for every option of every panel to decide what
  // it has to show. Almost all of that was for panels the reader never scrolled
  // to.
  //
  // `content-visibility: auto` (see the stylesheet) already stops the *browser*
  // laying out a panel that is off screen, but React builds it regardless; this
  // is the same idea carried into the render. The two agree by construction,
  // since both key off this element being near the viewport, and the panel's
  // `contain-intrinsic-height: auto 400px` reserves the space in the meantime —
  // so nothing here has to guess a placeholder height.
  //
  // Latched: once a panel has been built it stays built, so scrolling back over
  // it costs nothing and never discards the "Show all" state.
  const [detailNode, setDetailNode] = useState<HTMLDivElement | null>(null);
  // Starts true where there is no IntersectionObserver (jsdom in the unit
  // tests, very old browsers), so the panel renders everything rather than
  // nothing. Set as the initial state rather than from the effect below: the
  // check is a fact about the environment, not something that changes, and
  // flipping it from inside the effect is a state update React cannot
  // distinguish from a render loop.
  const [hasEnteredView, setHasEnteredView] = useState(
    typeof IntersectionObserver === 'undefined'
  );

  useEffect(() => {
    if (!detailNode || hasEnteredView) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      // Build a screenful ahead of the scroll, so a panel is ready by the time
      // it is looked at rather than assembling under the reader.
      { rootMargin: '600px 0px' }
    );
    observer.observe(detailNode);
    return () => observer.disconnect();
  }, [detailNode, hasEnteredView]);

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

  // Each section is `break-inside: avoid`, so it is an indivisible unit: a
  // panel with N sections can never usefully fill more than N columns. Without
  // this cap, a variant with only a couple of annotations spread those two
  // sections over the three or four columns the viewport had room for, leaving
  // most of the panel empty — which is what made sparse results look sparse.
  //
  // Capped at 3 as well: beyond that the columns are narrower than the widest
  // tables want (see `.sections`), and a very long panel gains little from a
  // fourth.
  // Gated on `hasEnteredView` here rather than only in the JSX below: this is
  // where the work actually happens — `renderPanel` walks every option of every
  // panel through the display spec — so returning early from the markup alone
  // would have saved nothing.
  const renderedSections: { id: string; node: ReactNode }[] = !hasEnteredView
    ? []
    : (panels ?? [])
        .map((panel) => ({ id: panel.id, node: renderPanel(panel) }))
        .filter((section): section is { id: string; node: ReactNode } =>
          Boolean(section.node)
        );

  // Phenotypes drops out of the column flow and takes the panel's full width at
  // the bottom. Its conditions tables are the widest thing here — four columns
  // of prose and links — and a ~400px column left every one of them wrapping.
  // The rest of the annotations are label/value rows that read better narrow.
  const columned = renderedSections.filter(
    (section) => section.id !== FULL_WIDTH_PANEL_ID
  );
  const fullWidth = renderedSections.filter(
    (section) => section.id === FULL_WIDTH_PANEL_ID
  );

  return (
    // The panel element is always here, empty until it comes near the viewport:
    // it is what the observer watches, and its reserved height is what keeps the
    // scroll from lurching while the contents are still to come.
    <div className={styles.detail} ref={setDetailNode}>
      {/* The toolbar sits outside the multi-column section list: an interactive
          control inside a CSS multicol (as a column-span:all element) can have
          its clicks swallowed by an overlapping column, which broke "Show all". */}
      {hasEnteredView && panels && parameters && (
        <div className={styles.detailToolbar}>
          <CheckboxWithLabel
            label="Show all"
            checked={showAll}
            onChange={setShowAll}
          />
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

      {/* Collapse control at the bottom-right — the same blue close (cross) used
          at the bottom of an expanded transcript list — so a long panel can be
          closed without scrolling back to the row's expand chevron. */}
      {hasEnteredView && onCollapse && (
        <div className={styles.collapseRow}>
          <CloseButton aria-label="Hide annotations" onClick={onCollapse} />
        </div>
      )}
    </div>
  );
};

/**
 * The one panel that leaves the column flow and runs the panel's full width,
 * beneath the rest.
 *
 * Named by its form-panel id, which arrives with the job's pinned panels — the
 * same contract that orders the sections. Its ClinVar conditions tables are the
 * widest thing the results detail draws, and in a ~400px column every column of
 * them wrapped.
 */
const FULL_WIDTH_PANEL_ID = 'phenotype_and_disease_associations';

const Section = (props: { title: ReactNode; children: ReactNode }) => (
  <div className={styles.section}>
    <div className={styles.sectionTitle}>{props.title}</div>
    <div className={styles.sectionBody}>{props.children}</div>
  </div>
);

export default VepResultsAnnotationDetail;
