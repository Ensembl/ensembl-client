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
import noop from 'lodash/noop';
import classNames from 'classnames';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import { PrimaryButton } from 'src/shared/components/button/Button';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as DownloadButton } from 'static/img/launchbar/custom-download.svg';
import Checkbox from 'src/shared/components/checkbox/Checkbox';

import { Status } from 'src/shared/types/status';
import {
  EntityViewerSidebarPayload,
  EntityViewerSidebarUIState
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

import styles from './GeneOverview.scss';

type Props = {
  sidebarPayload: EntityViewerSidebarPayload | null;
  sidebarUIState: EntityViewerSidebarUIState | null;
  updateEntityUI: (uIstate: Partial<EntityViewerSidebarUIState>) => void;
};

export type AccordionSectionID = 'function' | 'sequence' | 'other_data_sets';

// TODO: Remove me once instant download component is available
const mockOnClick = noop;

const MainAccordion = (props: Props) => {
  const { sidebarPayload, sidebarUIState } = props;

  if (!sidebarPayload) {
    return null;
  }

  const { gene } = sidebarPayload;
  const hasFunctionDescription = Boolean(gene.function?.description);

  const expandedPanels =
    (sidebarUIState?.mainAccordion?.expandedPanels as AccordionSectionID[]) ||
    (hasFunctionDescription ? ['function'] : []);

  const onChange = (expandedPanels: AccordionSectionID[] = []) => {
    props.updateEntityUI({
      mainAccordion: {
        expandedPanels
      }
    });
  };

  const functionAccordionButtonClass = classNames(
    styles.entityViewerAccordionButton,
    {
      [styles.entityViewerAccordionButtonDisabled]: !hasFunctionDescription
    }
  );

  return (
    <div className={styles.accordionContainer}>
      <Accordion
        className={styles.entityViewerAccordion}
        onChange={(expandedPanels) =>
          onChange(expandedPanels as AccordionSectionID[])
        }
        preExpanded={expandedPanels}
        allowMultipleExpanded={true}
      >
        <AccordionItem
          className={styles.entityViewerAccordionItem}
          uuid={'function'}
        >
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton
              className={functionAccordionButtonClass}
              disabled={!hasFunctionDescription}
            >
              Function
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            {gene.function?.description && (
              <div>
                <div className={styles.geneFunction}>
                  {gene.function.description}
                </div>
                {gene.function.source?.id && (
                  <ExternalReference
                    label={gene.function.source.name}
                    linkText={gene.function.source.id}
                    to={gene.function.source.url}
                    classNames={{
                      label: styles.providedBy
                    }}
                  />
                )}
              </div>
            )}
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem
          className={styles.entityViewerAccordionItem}
          uuid={'sequence'}
        >
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton className={styles.entityViewerAccordionButton}>
              Sequence
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <div className={styles.sequenceAccordion}>
              <div className={styles.geneDetails}>
                <span className={styles.geneTitle}>Gene</span>
                <span className={styles.stableId}>{gene.id}</span>
              </div>
              <div className={styles.geneCheckboxList}>
                {renderCheckbox({ label: 'Genomic sequence', checked: false })}
              </div>

              <div className={styles.accordionContentTitle}>
                All transcripts
              </div>
              <div className={styles.transcriptsCheckboxList}>
                {(gene.filters?.transcript?.sequence as {
                  label: string;
                }[]).map((filter, key) =>
                  renderCheckbox({
                    label: filter.label,
                    checked: false,
                    key: key
                  })
                )}
              </div>

              <div className={styles.sequenceDownload}>
                <PrimaryButton onClick={mockOnClick} isDisabled={true}>
                  Download
                </PrimaryButton>
              </div>

              <div className={styles.customDownload}>
                <div className={styles.label}>Get a custom download</div>
                <div className={styles.icon}>
                  <ImageButton
                    image={DownloadButton}
                    onClick={mockOnClick}
                    status={Status.SELECTED}
                  ></ImageButton>
                </div>
              </div>

              {gene.filters?.transcript.tark_url && (
                <div className={styles.tark}>
                  <div className={styles.description}>
                    Archive of transcript sequences, including historical gene
                    sets
                  </div>
                  <ExternalReference
                    label={'Ensembl Transcript Archive'}
                    linkText={'TARK'}
                    to={gene.filters.transcript.tark_url as string}
                    classNames={{ label: styles.tarkLabel }}
                  />
                </div>
              )}
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem
          className={styles.entityViewerAccordionItem}
          uuid={'other_data_sets'}
        >
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton
              className={styles.entityViewerAccordionButton}
              disabled={sidebarPayload.other_data_sets ? false : true}
            >
              Other data sets
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <div>
              {sidebarPayload.other_data_sets?.map((entry, key) =>
                renderStandardLabelValue({
                  label: entry.type,
                  value: entry.value,
                  key
                })
              )}
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const renderCheckbox = (props: {
  label: string;
  checked: boolean;
  key?: number;
}) => {
  // TODO: Remove me once instant download component is available
  const onChangeMock = noop;

  return (
    <div key={props.key}>
      <Checkbox onChange={onChangeMock} {...props} />
    </div>
  );
};

const renderStandardLabelValue = (props: {
  label: string;
  key?: number;
  value: string | JSX.Element;
}) => {
  return (
    <div className={styles.standardLabelValue} key={props.key}>
      <div className={styles.label}>{props.label}</div>
      <div className={styles.value}>{props.value}</div>
    </div>
  );
};

export default MainAccordion;
