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
import styles from './VepResultsAnnotationDetail.module.css';

/**
 * Question: why does this component have allele frequency, protvar url,
 * and opentargets variant id as distinct properties?
 */

const VepResultsAnnotationDetail = (props: {
  genomeId: string;
  consequence: PredictedMolecularConsequence;
  allele: AlternativeVariantAllele | undefined;
  parameters?: Record<string, unknown>;
  panels?: FormPanel[];
  display?: DisplaySpec | null;
  availableAfSources?: AfSource[];
  protvarUrl?: string;
  openTargetsVariantId?: string;
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

  const optionsById = useMemo(() => {
    const map = new Map<string, FormPanelOption>();
    for (const panel of panels ?? []) {
      for (const option of panel.options) {
        map.set(option.id, option);
      }
    }
    return map;
  }, [panels]);
  const helpFor = (optionId: string) => optionsById.get(optionId)?.help;

  const subOptionRan = (optionId: string, defaultValue: boolean) =>
    didSubOptionRun(parameters, optionId, defaultValue);

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
      consequence:
        consequence as PredictedTranscriptConsequence /* Question: why is the consequence asserted to be a transcript consequence? */,
      allele,
      showAll,
      subOptionRan,
      genomeId,
      protvarUrl,
      openTargetsVariantId,
      help: helpFor(optionId),
      vocabularies
    });
  };

  const renderOption = (option: FormPanelOption): ReactNode | null => {
    if (option.id === 'hgvs') {
      if (!optionRan('hgvs')) {
        return null;
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

// NOTE: it is probably bad that the client stores id of a panel that it has to treat specially
const FULL_WIDTH_PANEL_ID = 'phenotype_and_disease_associations';

const Section = (props: { title: ReactNode; children: ReactNode }) => (
  <div className={styles.section}>
    <div className={styles.sectionTitle}>{props.title}</div>
    <div className={styles.sectionBody}>{props.children}</div>
  </div>
);

export default VepResultsAnnotationDetail;
