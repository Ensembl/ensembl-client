import React from 'react';
import { connect } from 'react-redux';

import ExternalLink from 'src/content/app/entity-viewer/gene-view/components/external-link/ExternalLink';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import noop from 'lodash/noop';
import { PrimaryButton } from 'src/shared/components/button/Button';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as DownloadButton } from 'static/img/launchbar/custom-download.svg';

import { getEntityViewerSidebarPayload } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { RootState } from 'src/store';
import { Status } from 'src/shared/types/status';
import { EntityViewerSidebarPayload } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';
import { Publication } from 'src/content/app/entity-viewer/types/publication';

import styles from './Overview.scss';

// TODO: Remove me
const mockOnClick = noop;

type Props = {
  sidebarPayload: EntityViewerSidebarPayload | null;
};

const Overview = (props: Props) => {
  if (!props.sidebarPayload) {
    return null;
  }
  const { gene } = props.sidebarPayload;
  return (
    <div>
      <div className={styles.geneDetails}>
        <div className={styles.geneSymbol}>{gene.symbol}</div>
        <div className={styles.stableId}>{gene.id}</div>
      </div>

      <div className={styles.titleWithSeparator}>Gene name</div>

      <div className={styles.geneName}>
        <ExternalLink
          label={gene.name}
          linkText={'HGNC:1101'}
          linkUrl={'https://www.uniprot.org/uniprot/H0YE37'}
        />
      </div>
      {gene.synonyms && (
        <div>
          <div className={styles.titleWithSeparator}>Synonyms</div>
          <div className={styles.synonyms}>{gene.synonyms.join(', ')}</div>
        </div>
      )}
      {gene.attributes && (
        <div>
          <div className={styles.titleWithSeparator}>Additional attributes</div>
          <div>
            {gene.attributes.map((attribute, key) => (
              <div key={key}> {attribute} </div>
            ))}
          </div>
        </div>
      )}

      <div>{renderMainAccordion(props)}</div>

      {props.sidebarPayload.homeologues && (
        <div className={styles.homeologues}>
          <div className={styles.titleWithSeparator}>Homeologues</div>
          <div>
            {props.sidebarPayload.homeologues.map((homeologue, key) =>
              renderStandardLabelValue({
                label: homeologue.type,
                value: <a href={''}>{homeologue.stable_id}</a>,
                key: key
              })
            )}
          </div>
        </div>
      )}
      {props.sidebarPayload.other_assemblies && (
        <div>
          <div className={styles.titleWithSeparator}>
            Other assemblies with this gene
          </div>
          <div>
            {props.sidebarPayload.other_assemblies.map((otherAssembly, key) => (
              <div className={styles.otherAssembly} key={key}>
                <div className={styles.speciesName}>
                  {otherAssembly.species_name}
                </div>
                <div className={styles.geneName}>
                  {otherAssembly.assembly_name}
                </div>
                <div className={styles.stableId}>{otherAssembly.stable_id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        {props.sidebarPayload.publications &&
          renderPublicationsAccordion(props.sidebarPayload.publications)}
      </div>
    </div>
  );
};

const renderPublicationsAccordion = (publications: Publication[]) => {
  return (
    <div className={styles.accordionContainer}>
      <Accordion className={styles.entityViewerAccordion}>
        <AccordionItem className={styles.entityViewerAccordionItem}>
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton className={styles.entityViewerAccordionButton}>
              Publications
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <div>
              {publications.map((entry, key) => renderPublication(entry, key))}
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const renderPublication = (props: Publication, key: number) => {
  return (
    <div className={styles.publication} key={key}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.description}>{props.description}</div>
      <ExternalLink linkText={props.source.value} linkUrl={props.source.url} />
      <div className={styles.sourceDescription}>{props.source.name}</div>
    </div>
  );
};

const renderMainAccordion = (props: Props) => {
  if (!props.sidebarPayload) {
    return null;
  }
  const { gene } = props.sidebarPayload;

  return (
    <div className={styles.accordionContainer}>
      <Accordion className={styles.entityViewerAccordion}>
        <AccordionItem className={styles.entityViewerAccordionItem}>
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton
              className={styles.entityViewerAccordionButton}
              disabled={gene.function ? false : true}
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
                  <ExternalLink
                    label={gene.function.source.name}
                    linkText={gene.function.source.value}
                    linkUrl={gene.function.source.url}
                    classNames={{
                      labelClass: styles.providedBy
                    }}
                  />
                )}
              </div>
            )}
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem className={styles.entityViewerAccordionItem}>
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
                <div className={styles.geneTitle}>Gene</div>
                <div className={styles.stableId}>ENSG00000139618.15</div>
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
                  <ExternalLink
                    label={'Ensembl Transcript Archive'}
                    linkText={'TARK'}
                    linkUrl={gene.filters.transcript.tark_url as string}
                    classNames={{ labelClass: styles.tarkLabel }}
                  />
                </div>
              )}
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem className={styles.entityViewerAccordionItem}>
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

const renderCheckbox = (props: {
  label: string;
  checked: boolean;
  key?: number;
}) => {
  // TODO: Remove me
  const onChangeMock = noop;

  return (
    <div key={props.key}>
      <Checkbox onChange={onChangeMock} {...props} />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  sidebarPayload: getEntityViewerSidebarPayload(state)
});

export default connect(mapStateToProps)(Overview);
