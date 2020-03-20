import React from 'react';

import ExternalLink from 'src/content/app/entity-viewer/gene-view/components/external-link/ExternalLink';

import { entityViewResponse } from '../sampleData';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';

import styles from './ExternalReferences.scss';

const xrefs = [
  {
    source: 'Expression Atlas',
    links: [
      {
        label: 'Expression Atlas',
        anchor_text: 'ENSG00000139618',
        url: ''
      }
    ]
  },
  {
    source: 'GENCODE comprehensive gene set',
    links: [
      {
        label: 'GENCODE comprehensive gene set',
        anchor_text: 'GENCODE',
        url: ''
      }
    ]
  },
  {
    source: 'Human CCDS',
    links: [
      {
        label: 'Human CCDS',
        anchor_text: 'PCCDS9344.1',
        url: ''
      }
    ]
  },
  {
    source: 'LRG',
    links: [
      {
        label: 'LRG',
        anchor_text: 'LRG_293',
        url: ''
      }
    ]
  },
  {
    source: 'NCBI Gene ID',
    links: [
      {
        label: 'NCBI Gene ID',
        anchor_text: '675',
        url: ''
      }
    ]
  },
  {
    source: 'OMIM',
    links: [
      {
        label: 'OMIM',
        anchor_text: '600185',
        url: ''
      }
    ]
  },

  {
    source: 'Reactome',
    links: [
      {
        label: 'Cell Cycle',
        anchor_text: 'R-HSA-1640170',
        url: ''
      },
      {
        label: 'DNA Double-Strand Break Repair',
        anchor_text: 'R-HSA-5693532',
        url: ''
      },
      {
        label: 'DNA Repair',
        anchor_text: 'R-HSA-73894',
        url: ''
      },
      {
        label: 'HDR through Homologous Recombination (HRR)',
        anchor_text: 'R-HSA-5685942',
        url: ''
      },
      {
        label:
          'HDR through Homologous Recombination (HRR) or Single Strand Annealing (SSA)',
        anchor_text: 'R-HSA-5693567',
        url: ''
      }
    ]
  },

  {
    source: 'UniProt',
    links: [
      {
        label: 'UniProt',
        anchor_text: 'P51587',
        url: ''
      }
    ]
  },

  {
    source: 'WikiGene',
    links: [
      {
        label: 'WikiGene',
        anchor_text: 'BRCA2',
        url: ''
      }
    ]
  }
];
const ExternalReferences = () => {
  return (
    <div>
      <div className={styles.geneDetails}>
        <div className={styles.geneSymbol}>
          {entityViewResponse.gene.symbol}
        </div>
        <div className={styles.stableId}>
          {entityViewResponse.gene.stable_id}
        </div>
      </div>

      <div className={styles.titleWithSeparator}>Gene</div>
      {xrefs &&
        xrefs.map((xref, key) => {
          if (xref.links.length === 1) {
            return (
              <div key={key}>
                <ExternalLink
                  label={xref.links[0].label}
                  linkUrl={xref.links[0].url}
                  linkText={xref.links[0].anchor_text}
                />
              </div>
            );
          } else {
            return (
              <div className={styles.accordionContainer}>
                <Accordion className={styles.entityViewerAccordion}>
                  <AccordionItem className={styles.entityViewerAccordionItem}>
                    <AccordionItemHeading
                      className={styles.entityViewerAccordionHeader}
                    >
                      <AccordionItemButton
                        className={styles.entityViewerAccordionButton}
                      >
                        {xref.source}
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel
                      className={styles.entityViewerAccordionItemContent}
                    >
                      <div>
                        {xref.links.map((entry, key) => (
                          <ExternalLink
                            label={entry.label}
                            linkUrl={entry.url}
                            linkText={entry.anchor_text}
                            key={key}
                          />
                        ))}
                      </div>
                    </AccordionItemPanel>
                  </AccordionItem>
                </Accordion>
              </div>
            );
          }
        })}
    </div>
  );
};

export default ExternalReferences;
