/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
import {
  CrossReference,
  CrossReferenceGroup
} from 'src/content/app/entity-viewer/types/crossReference';
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

const getFormattedCrossReferences = (crossReferences: CrossReference[]) => {
  const geneCrossReferences: { [key: string]: CrossReferenceGroup } = {};

  crossReferences.forEach((xref) => {
    const sourceId = xref.source.id;

    if (!geneCrossReferences[sourceId]) {
      geneCrossReferences[sourceId] = {
        source: xref.source,
        references: []
      };
    }

    geneCrossReferences[sourceId].references.push({
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

  // TODO: The genomeId is temporarily hardcoded here as Thoas does ot have date for homo_sapiens_GCA_000001405_27.
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
          if (xrefs.references.length === 1) {
            return (
              <div key={key}>
                <ExternalReference
                  label={xrefs.source.name}
                  to={xrefs.references[0].url}
                  linkText={xrefs.references[0].id}
                />
              </div>
            );
          } else {
            return xrefs.references[0].name === xrefs.source.name
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

const renderXrefGroupWithSameLabels = (
  xref: CrossReferenceGroup,
  key: number
) => {
  return (
    <div key={key} className={styles.xrefGroupWithSameLabel}>
      <div className={styles.xrefGroupSourceName}>{xref.source.name}</div>
      <div className={styles.xrefGroupLinks}>
        {xref.references.map((entry, key) => (
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
  xref: CrossReferenceGroup,
  key: number
) => {
  return (
    <div className={styles.accordionContainer} key={key}>
      <Accordion className={styles.xrefAccordion}>
        <AccordionItem className={styles.xrefAccordionItem}>
          <AccordionItemHeading className={styles.xrefAccordionHeader}>
            <AccordionItemButton className={styles.xrefAccordionButton}>
              {xref.source.name}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.xrefAccordionItemContent}>
            <div>
              {xref.references.map((entry, key) => (
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
