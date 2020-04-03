import React from 'react';
import { connect } from 'react-redux';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import { getEntityViewerSidebarPayload } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { RootState } from 'src/store';
import { EntityViewerSidebarPayload } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';
import { ExternalLink } from 'src/content/app/entity-viewer/types/externalLink';

import styles from './GeneExternalReferences.scss';

type Props = {
  sidebarPayload: EntityViewerSidebarPayload | null;
};

const GeneExternalReferences = (props: Props) => {
  if (!props.sidebarPayload) {
    return <div>No data to display</div>;
  }
  return (
    <div>
      <div className={styles.geneDetails}>
        <div className={styles.geneSymbol}>
          {props.sidebarPayload.gene.symbol}
        </div>
        <div className={styles.stableId}>{props.sidebarPayload.gene.id}</div>
      </div>

      <div className={styles.sectionHead}>Gene</div>
      {props.sidebarPayload.gene?.xrefs &&
        props.sidebarPayload.gene.xrefs.map((xref, key) => {
          if (xref.links.length === 1) {
            return (
              <div key={key}>
                <ExternalReference
                  label={xref.links[0].name}
                  to={xref.links[0].url}
                  linkText={xref.links[0].value}
                />
              </div>
            );
          } else {
            return xref.links[0].name === xref.source_name
              ? renderXrefGroupWithSameLabels(xref, key)
              : renderXrefGroupWithDifferentLabels(xref, key);
          }
        })}

      {props.sidebarPayload.gene.transcripts && (
        <div>
          <div className={styles.sectionHead}>Transcripts</div>
          {props.sidebarPayload.gene.transcripts.map((transcript, key) => {
            return (
              <div key={key} className={styles.transcriptWrapper}>
                <a href="">{transcript.id}</a>
                {transcript.xrefs && (
                  <div className={styles.transcriptXrefs}>
                    {transcript.xrefs.map((xref, key) => (
                      <ExternalReference
                        label={xref.name}
                        to={xref.url}
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

const renderXrefGroupWithSameLabels = (xref: ExternalLink, key: number) => {
  return (
    <div key={key} className={styles.xrefGroupWithSameLabel}>
      <span className={styles.xrefGroupSourceName}>{xref.source_name}</span>
      <span>
        {xref.links.map((entry, key) => (
          <ExternalReference
            label={''}
            to={entry.url}
            linkText={entry.value}
            key={key}
          />
        ))}
      </span>
    </div>
  );
};

const renderXrefGroupWithDifferentLabels = (
  xref: ExternalLink,
  key: number
) => {
  return (
    <div className={styles.accordionContainer} key={key}>
      <Accordion className={styles.xrefAccordion}>
        <AccordionItem className={styles.xrefAccordionItem}>
          <AccordionItemHeading className={styles.xrefAccordionHeader}>
            <AccordionItemButton className={styles.xrefAccordionButton}>
              {xref.source_name}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.xrefAccordionItemContent}>
            <div>
              {xref.links.map((entry, key) => (
                <ExternalReference
                  label={entry.name}
                  to={entry.url}
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
};

const mapStateToProps = (state: RootState) => ({
  sidebarPayload: getEntityViewerSidebarPayload(state)
});

export default connect(mapStateToProps)(GeneExternalReferences);
