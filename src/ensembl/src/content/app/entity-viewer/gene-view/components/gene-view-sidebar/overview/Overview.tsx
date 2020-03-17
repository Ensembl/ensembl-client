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

const synonyms = ['BRCC2', 'FACD', 'FAD', 'FAD1', 'FANCD', 'FANCD1', 'XRCC11'];
const additionalAttributes = ['protein coding', 'another attribute'];

const otherAssemblies = [
  { speciesName: 'Human', assemblyName: 'GRCh37', stableId: 'ENSG00000139618' }
];
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
            <div>Sequence content</div>
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

export default Overview;
