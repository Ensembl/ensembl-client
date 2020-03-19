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

const synonyms = ['BRCC2', 'FACD', 'FAD', 'FAD1', 'FANCD', 'FANCD1', 'XRCC11'];
const additionalAttributes = ['protein coding', 'another attribute'];
const transcriptSequenceFilters = [
  {
    value: 'Genomic sequence',
    label: 'Genomic sequence'
  },
  {
    value: 'cDNA',
    label: 'cDNA'
  },
  {
    value: 'CDS',
    label: 'CDS'
  },
  {
    value: 'Protein sequence',
    label: 'Protein sequence'
  }
];

const otherAssemblies = [
  { speciesName: 'Human', assemblyName: 'GRCh37', stableId: 'ENSG00000139618' }
];

// TODO: Remove me
const mockOnClick = noop;

const Overview = () => {
  return (
    <div>
      <div className={styles.geneDetails}>
        <div className={styles.geneSymbol}>BRCA2</div>
        <div className={styles.stableId}>ENSG00000139618.15</div>
      </div>

      <div className={styles.titleWithSeparator}>Gene name</div>

      <div className={styles.geneName}>
        <ExternalLink
          label={'BRCA2, DNA repair associated'}
          linkText={'HGNC:1101'}
          linkUrl={'https://www.uniprot.org/uniprot/H0YE37'}
        />
      </div>

      <div className={styles.titleWithSeparator}>Synonyms</div>
      <div className={styles.synonyms}>{synonyms.join(', ')}</div>

      <div className={styles.titleWithSeparator}>Additional attributes</div>
      <div>
        {additionalAttributes.map((attribute, key) => (
          <div key={key}> {attribute} </div>
        ))}
      </div>

      <div className={styles.titleWithSeparator}>
        Other assemblies with this gene
      </div>
      <div>
        {otherAssemblies.map((otherAssembly, key) => (
          <div className={styles.otherAssembly} key={key}>
            <div className={styles.speciesName}>
              {otherAssembly.speciesName}
            </div>
            <div className={styles.geneName}>{otherAssembly.assemblyName}</div>
            <div className={styles.stableId}>{otherAssembly.stableId}</div>
          </div>
        ))}
      </div>

      <div>{getMainAccordion()}</div>
    </div>
  );
};

const getMainAccordion = () => {
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
            <div>
              <div className={styles.geneFunction}>
                Involved in double-strand break repair and/or homologous
                recombination. Binds RAD51 and potentiates recombinational DNA
                repair by promoting assembly of RAD51 onto singlestranded DNA
                (ssDNA). Acts by targeting RAD51 to ssDNA over double-stranded
                DNA, enabling RAD51 to displace replication protein-A (RPA) from
                ssDNA and stabilizing RAD51-ssDNA filaments by blocking ATP
                hydrolysis. May participate in S phase checkpoint activation.
                Binds selectively to ssDNA, and to ssDNA in tailed duplexes and
                replication fork structures. In concert with NPM1, regulates
                centrosome duplication
              </div>
              <ExternalLink
                label={'Provided by UniProt'}
                linkText={'P51587'}
                linkUrl={'https://www.uniprot.org/uniprot/P51587'}
                classNames={{
                  labelClass: styles.providedBy
                }}
              />
            </div>
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
                {transcriptSequenceFilters.map((filter, key) =>
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
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem className={styles.entityViewerAccordionItem}>
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton className={styles.entityViewerAccordionButton}>
              Other data sets
            </AccordionItemButton>
          </AccordionItemHeading>
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
  // TODO: Remove me
  const onChangeMock = noop;

  return (
    <div key={props.key}>
      <Checkbox onChange={onChangeMock} {...props} />
    </div>
  );
};

export default Overview;
