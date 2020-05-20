import React from 'react';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useParams } from 'react-router';

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
import { CrossReference } from 'src/content/app/entity-viewer/types/crossReference';
import { EntityViewerParams } from 'src/content/app/entity-viewer/EntityViewer';

import styles from './GeneExternalReferences.scss';

const QUERY = gql`
  query Gene($stable_id: String!, $genome_id: String!) {
    gene(byId: { stable_id: $stable_id, genome_id: $genome_id }) {
      name
      stable_id
      cross_references {
        id
        name
        description
        url
        source {
          id
          name
          url
        }
      }
      transcripts {
        stable_id
        cross_references {
          id
          name
          description
          url
          source {
            id
            name
            url
          }
        }
      }
    }
  }
`;

type Gene = {
  name: string;
  stable_id: string;
  transcripts: {
    stable_id: string;
    cross_references: CrossReference[];
  }[];
  cross_references: CrossReference[];
};

type ExternalLinks = {
  source_name: string;
  links: {
    id: string;
    url: string;
    name: string;
    description: string;
  }[];
};

const getFormattedCrossReferences = (crossReferences: CrossReference[]) => {
  const geneCrossReferences: { [key: string]: ExternalLinks } = {};

  crossReferences.forEach((xref) => {
    const sourceId = xref.source.id;

    if (!geneCrossReferences[sourceId]) {
      geneCrossReferences[sourceId] = {
        source_name: xref.source.name,
        links: []
      };
    }

    geneCrossReferences[sourceId].links.push({
      id: xref.id,
      url: xref.url,
      name: xref.name,
      description: xref.description
    });
  });

  return geneCrossReferences;
};

const GeneExternalReferences = () => {
  const params: EntityViewerParams = useParams();

  const entityId = params.entityId?.split(':').pop();

  const { data, loading } = useQuery<{ gene: Gene }>(QUERY, {
    variables: {
      stable_id: entityId,
      genome_id: 'homo_sapiens_GCA_000001405_28'
    },
    skip: !entityId
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.gene) {
    return <div>No data to display</div>;
  }

  const geneCrossReferences = getFormattedCrossReferences(
    data.gene.cross_references
  );
  const { transcripts } = data.gene;

  return (
    <div className={styles.xrefsContainer}>
      <div className={styles.geneDetails}>
        <div className={styles.geneSymbol}>{data.gene.name}</div>
        <div className={styles.stableId}>{data.gene.stable_id}</div>
      </div>

      <div className={styles.sectionHead}>Gene</div>
      {data.gene.cross_references &&
        Object.values(geneCrossReferences).map((xrefs, key) => {
          if (xrefs.links.length === 1) {
            return (
              <div key={key}>
                <ExternalReference
                  label={xrefs.source_name}
                  to={xrefs.links[0].url}
                  linkText={xrefs.links[0].id}
                />
              </div>
            );
          } else {
            return xrefs.links[0].name === xrefs.source_name
              ? renderXrefGroupWithSameLabels(xrefs, key)
              : renderXrefGroupWithDifferentLabels(xrefs, key);
          }
        })}

      {transcripts && (
        <div>
          <div className={styles.sectionHead}>Transcripts</div>
          {transcripts.map((transcript, key) => {
            return (
              <div key={key} className={styles.transcriptWrapper}>
                <a href="">{transcript.stable_id}</a>
                {transcript.cross_references && (
                  <div className={styles.transcriptXrefs}>
                    {transcript.cross_references.map((xref, key) => (
                      <ExternalReference
                        label={xref.source.name}
                        to={xref.url}
                        linkText={xref.id}
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

const renderXrefGroupWithSameLabels = (xref: ExternalLinks, key: number) => {
  return (
    <div key={key} className={styles.xrefGroupWithSameLabel}>
      <div className={styles.xrefGroupSourceName}>{xref.source_name}</div>
      <div className={styles.xrefGroupLinks}>
        {xref.links.map((entry, key) => (
          <ExternalReference
            label={''}
            to={entry.url}
            linkText={entry.id}
            key={key}
          />
        ))}
      </div>
    </div>
  );
};

const renderXrefGroupWithDifferentLabels = (
  xref: ExternalLinks,
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
                  label={entry.description}
                  to={entry.url}
                  linkText={entry.id}
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
