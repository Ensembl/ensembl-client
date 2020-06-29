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

import React, { useState } from 'react';
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

type Transcript = {
  stable_id: string;
  cross_references: CrossReference[];
};

type Gene = {
  name: string;
  stable_id: string;
  transcripts: Transcript[];
  cross_references: CrossReference[];
};

const buildCrossReferenceGroups = (crossReferences: CrossReference[]) => {
  const crossReferenceGroups: { [key: string]: CrossReferenceGroup } = {};

  crossReferences.forEach((crossReference) => {
    const sourceId = crossReference.source.id;

    if (!crossReferenceGroups[sourceId]) {
      crossReferenceGroups[sourceId] = {
        source: crossReference.source,
        references: []
      };
    }

    crossReferenceGroups[sourceId].references.push({
      id: crossReference.id,
      url: crossReference.url,
      name: crossReference.name,
      description: crossReference.description
    });
  });

  return crossReferenceGroups;
};

const GeneExternalReferences = () => {
  const params: EntityViewerParams = useParams();

  const { entityId, genomeId } = params;

  const stableId = entityId?.split(':').pop();

  const { data, loading } = useQuery<{ gene: Gene }>(QUERY, {
    variables: {
      stable_id: stableId,
      genome_id: genomeId
    },
    skip: !stableId
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.gene) {
    return <div>No data to display</div>;
  }

  const crossReferenceGroups = buildCrossReferenceGroups(
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
        Object.values(crossReferenceGroups).map((crossReferenceGroup, key) => {
          if (crossReferenceGroup.references.length === 1) {
            return (
              <div key={key}>
                <ExternalReference
                  label={crossReferenceGroup.source.name}
                  to={crossReferenceGroup.references[0].url}
                  linkText={crossReferenceGroup.references[0].id}
                />
              </div>
            );
          } else {
            return crossReferenceGroup.references[0].name ===
              crossReferenceGroup.source.name
              ? renderXrefGroupWithSameLabels(crossReferenceGroup, key)
              : renderXrefGroupWithDifferentLabels(crossReferenceGroup, key);
          }
        })}

      {transcripts && (
        <div>
          <div className={styles.sectionHead}>Transcripts</div>
          {transcripts.map((transcript, key) => {
            return (
              <div key={key}>
                {' '}
                <RenderTranscriptXrefGroup transcript={transcript} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RenderTranscriptXrefGroup = (props: { transcript: Transcript }) => {
  const { transcript } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.transcriptWrapper}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.transcriptId}
      >
        {transcript.stable_id}
      </div>
      {transcript.cross_references && isExpanded && (
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
};

const renderXrefGroupWithSameLabels = (
  crossReferenceGroup: CrossReferenceGroup,
  key: number
) => {
  return (
    <div key={key} className={styles.xrefGroupWithSameLabel}>
      <div className={styles.xrefGroupSourceName}>
        {crossReferenceGroup.source.name}
      </div>
      <div className={styles.xrefGroupLinks}>
        {crossReferenceGroup.references.map((entry, key) => (
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
  crossReferenceGroup: CrossReferenceGroup,
  key: number
) => {
  return (
    <div className={styles.accordionContainer} key={key}>
      <Accordion className={styles.xrefAccordion}>
        <AccordionItem className={styles.xrefAccordionItem}>
          <AccordionItemHeading className={styles.xrefAccordionHeader}>
            <AccordionItemButton className={styles.xrefAccordionButton}>
              {crossReferenceGroup.source.name}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.xrefAccordionItemContent}>
            <div>
              {crossReferenceGroup.references.map((entry, key) => (
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
