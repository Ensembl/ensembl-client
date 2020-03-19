import React from 'react';

import ExternalLink from 'src/content/app/entity-viewer/gene-view/components/external-link/ExternalLink';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';

import styles from './Overview.scss';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import noop from 'lodash/noop';
import { PrimaryButton } from 'src/shared/components/button/Button';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as DownloadButton } from 'static/img/launchbar/custom-download.svg';
import { Status } from 'src/shared/types/status';

import { entityViewResponse } from '../sampleData';

// TODO: Remove me
const mockOnClick = noop;

const { gene } = entityViewResponse;

const Overview = () => {
  return (
    <div>
      <div className={styles.geneDetails}>
        <div className={styles.geneSymbol}>{gene.symbol}</div>
        <div className={styles.stableId}>{gene.stable_id}</div>
      </div>

      <div className={styles.titleWithSeparator}>Gene name</div>

      <div className={styles.geneName}>
        <ExternalLink
          label={gene.name}
          linkText={'HGNC:1101'}
          linkUrl={'https://www.uniprot.org/uniprot/H0YE37'}
        />
      </div>

      <div className={styles.titleWithSeparator}>Synonyms</div>
      <div className={styles.synonyms}>{gene.synonyms.join(', ')}</div>

      <div className={styles.titleWithSeparator}>Additional attributes</div>
      <div>
        {gene.attributes.map((attribute, key) => (
          <div key={key}> {attribute} </div>
        ))}
      </div>

      <div>{renderMainAccordion()}</div>
      {entityViewResponse.homeologues && (
        <div className={styles.homeologues}>
          <div className={styles.titleWithSeparator}>Homeologues</div>
          <div>
            {entityViewResponse.homeologues.map((homeologue) =>
              renderStandardLabelValue({
                label: homeologue.type,
                value: <a href={''}>{homeologue.stableId}</a>
              })
            )}
          </div>
        </div>
      )}

      <div className={styles.titleWithSeparator}>
        Other assemblies with this gene
      </div>
      <div>
        {entityViewResponse.other_assemblies.map((otherAssembly, key) => (
          <div className={styles.otherAssembly} key={key}>
            <div className={styles.speciesName}>
              {otherAssembly.speciesName}
            </div>
            <div className={styles.geneName}>{otherAssembly.assemblyName}</div>
            <div className={styles.stableId}>{otherAssembly.stableId}</div>
          </div>
        ))}
      </div>

      <div>
        {entityViewResponse.publications && renderPublicationsAccordion()}
      </div>
    </div>
  );
};

const renderPublicationsAccordion = () => {
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
              {entityViewResponse.publications.map((entry) =>
                renderPublication(entry)
              )}
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const renderPublication = (props: Publication) => {
  return (
    <div className={styles.publication}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.description}>{props.description}</div>
      <ExternalLink linkText={props.linkText} linkUrl={props.linkUrl} />
      <div className={styles.sourceDescription}>{props.sourceDescription}</div>
    </div>
  );
};

type Publication = {
  title?: string;
  description?: string;
  linkUrl: string;
  linkText: string;
  sourceDescription?: string;
};

const renderMainAccordion = () => {
  return (
    <div className={styles.accordionContainer}>
      <Accordion className={styles.entityViewerAccordion}>
        <AccordionItem className={styles.entityViewerAccordionItem}>
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton className={styles.entityViewerAccordionButton}>
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
                {gene.function?.source?.value && (
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
                {gene.transcript?.sequence?.filters.map((filter, key) =>
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

              {gene.transcript.tark_url && (
                <div className={styles.tark}>
                  <div className={styles.description}>
                    Archive of transcript sequences, including historical gene
                    sets
                  </div>
                  <ExternalLink
                    label={'Ensembl Transcript Archive'}
                    linkText={'TARK'}
                    linkUrl={gene.transcript.tark_url}
                    classNames={{ labelClass: styles.tarkLabel }}
                  />
                </div>
              )}
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem className={styles.entityViewerAccordionItem}>
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton className={styles.entityViewerAccordionButton}>
              Other data sets
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <div>
              {entityViewResponse.other_date_sets.map((entry) =>
                renderStandardLabelValue(entry)
              )}
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const renderStandardLabelValue = (prop: {
  label: string;
  value: string | JSX.Element;
}) => {
  return (
    <div className={styles.standardLabelValue}>
      <div className={styles.label}>{prop.label}</div>
      <div className={styles.value}>{prop.value}</div>
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

export default Overview;
