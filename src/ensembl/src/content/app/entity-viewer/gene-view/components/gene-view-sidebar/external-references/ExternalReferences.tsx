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
      {entityViewResponse.gene?.xrefs &&
        entityViewResponse.gene.xrefs.map((xref, key) => {
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
                <Accordion className={styles.xrefAccordion}>
                  <AccordionItem className={styles.xrefAccordionItem}>
                    <AccordionItemHeading
                      className={styles.xrefAccordionHeader}
                    >
                      <AccordionItemButton
                        className={styles.xrefAccordionButton}
                      >
                        {xref.source}
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel
                      className={styles.xrefAccordionItemContent}
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

      {entityViewResponse.gene.transcripts && (
        <div>
          <div className={styles.titleWithSeparator}>Transcripts</div>
          {entityViewResponse.gene.transcripts.map((transcript, key) => {
            return (
              <div key={key} className={styles.transcriptWrapper}>
                <a href="">{transcript.stable_id}</a>
                {transcript.xrefs && (
                  <div className={styles.transcriptXrefs}>
                    {transcript.xrefs.map((xref, key) => (
                      <ExternalLink
                        label={xref.label}
                        linkUrl={xref.url}
                        linkText={xref.anchor_text}
                        key={key}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExternalReferences;
