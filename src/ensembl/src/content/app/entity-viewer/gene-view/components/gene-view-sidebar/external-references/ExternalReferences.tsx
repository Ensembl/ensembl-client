import React from 'react';
import { connect } from 'react-redux';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import { getEntityViewerSidebarPayload } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { RootState } from 'src/store';
import { EntityViewerSidebarPayload } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

import styles from './ExternalReferences.scss';

type Props = {
  sidebarPayload: EntityViewerSidebarPayload | null;
};

const ExternalReferences = (props: Props) => {
  if (!props.sidebarPayload) {
    return null;
  }
  return (
    <div>
      <div className={styles.geneDetails}>
        <div className={styles.geneSymbol}>
          {props.sidebarPayload.gene.symbol}
        </div>
        <div className={styles.stableId}>{props.sidebarPayload.gene.id}</div>
      </div>

      <div className={styles.titleWithSeparator}>Gene</div>
      {props.sidebarPayload.gene?.xrefs &&
        props.sidebarPayload.gene.xrefs.map((xref, key) => {
          if (xref.links.length === 1) {
            return (
              <div key={key}>
                <ExternalLink
                  label={xref.links[0].name}
                  linkUrl={xref.links[0].url}
                  linkText={xref.links[0].value}
                />
              </div>
            );
          } else {
            return (
              <div className={styles.accordionContainer} key={key}>
                <Accordion className={styles.xrefAccordion}>
                  <AccordionItem className={styles.xrefAccordionItem}>
                    <AccordionItemHeading
                      className={styles.xrefAccordionHeader}
                    >
                      <AccordionItemButton
                        className={styles.xrefAccordionButton}
                      >
                        {xref.source_name}
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel
                      className={styles.xrefAccordionItemContent}
                    >
                      <div>
                        {xref.links.map((entry, key) => (
                          <ExternalLink
                            label={entry.name}
                            linkUrl={entry.url}
                            linkText={entry.value}
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

      {props.sidebarPayload.gene.transcripts && (
        <div>
          <div className={styles.titleWithSeparator}>Transcripts</div>
          {props.sidebarPayload.gene.transcripts.map((transcript, key) => {
            return (
              <div key={key} className={styles.transcriptWrapper}>
                <a href="">{transcript.id}</a>
                {transcript.xrefs && (
                  <div className={styles.transcriptXrefs}>
                    {transcript.xrefs.map((xref, key) => (
                      <ExternalLink
                        label={xref.name}
                        linkUrl={xref.url}
                        linkText={xref.value}
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

const mapStateToProps = (state: RootState) => ({
  sidebarPayload: getEntityViewerSidebarPayload(state)
});

export default connect(mapStateToProps)(ExternalReferences);
