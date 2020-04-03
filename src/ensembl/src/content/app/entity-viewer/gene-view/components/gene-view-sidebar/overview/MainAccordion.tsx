import React from 'react';
import noop from 'lodash/noop';

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
import JSONValue from 'src/shared/types/JSON';
import { EntityViewerSidebarPayload } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

import styles from './GeneOverview.scss';

type Props = {
  sidebarPayload: EntityViewerSidebarPayload | null;
  sidebarUIState: { [key: string]: JSONValue } | null;
  updateEntityUI: (uIstate: { [key: string]: JSONValue }) => void;
};

// TODO: Remove me once instant download component is available
const mockOnClick = noop;

const MainAccordion = (props: Props) => {
  if (!props.sidebarPayload) {
    return null;
  }
  const { gene } = props.sidebarPayload;
  const expandedPanels = props.sidebarUIState?.mainAccordion
    ?.expandedPanels as string[];

  const onChange = (expandedPanels: (string | number)[] = []) => {
    props.updateEntityUI({
      mainAccordion: {
        expandedPanels
      }
    });
  };

  return (
    <div className={styles.accordionContainer}>
      <Accordion
        className={styles.entityViewerAccordion}
        onChange={onChange}
        preExpanded={expandedPanels}
        allowMultipleExpanded={true}
      >
        <AccordionItem
          className={styles.entityViewerAccordionItem}
          uuid={'function'}
        >
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton
              className={styles.entityViewerAccordionButton}
              disabled={!gene.function}
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
                {gene.function.source?.value && (
                  <ExternalReference
                    label={gene.function.source.name}
                    linkText={gene.function.source.value}
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
              disabled={props.sidebarPayload.other_data_sets ? false : true}
            >
              Other data sets
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <div>
              {props.sidebarPayload.other_data_sets?.map((entry, key) =>
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
