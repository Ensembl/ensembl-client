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
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router';
import sortBy from 'lodash/sortBy';

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
  ExternalReference as ExternalReferenceType,
  ExternalReferencesGroup
} from 'src/content/app/entity-viewer/types/externalReference';
import { EntityViewerParams } from 'src/content/app/entity-viewer/EntityViewer';

import styles from './GeneExternalReferences.scss';
import { parseEnsObjectIdFromUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

const QUERY = gql`
  query Gene($stable_id: String!, $genome_id: String!) {
    gene(byId: { stable_id: $stable_id, genome_id: $genome_id }) {
      stable_id
      symbol
      external_references {
        accession_id
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
        external_references {
          accession_id
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
  external_references: ExternalReferenceType[];
};

type Gene = {
  symbol: string;
  stable_id: string;
  transcripts: Transcript[];
  external_references: ExternalReferenceType[];
};

const buildExternalReferencesGroups = (
  externalReferences: ExternalReferenceType[]
) => {
  const externalReferencesGroups: {
    [key: string]: ExternalReferencesGroup;
  } = {};

  const sortedExternalReferences = sortBy(
    externalReferences,
    (reference) => reference.source.name
  );

  sortedExternalReferences.forEach((externalReference) => {
    const sourceId = externalReference.source.id;

    if (!externalReferencesGroups[sourceId]) {
      externalReferencesGroups[sourceId] = {
        source: externalReference.source,
        references: []
      };
    }

    externalReferencesGroups[sourceId].references.push({
      accession_id: externalReference.accession_id,
      url: externalReference.url,
      name: externalReference.name,
      description: externalReference.description
    });
  });

  // Sort the xrefs within each group based on description (or accession_id when description is empty)
  Object.keys(externalReferencesGroups).forEach((sourceId) => {
    externalReferencesGroups[sourceId].references = sortBy(
      externalReferencesGroups[sourceId].references,
      (reference) => reference.description || reference.accession_id
    );
  });

  return externalReferencesGroups;
};

const GeneExternalReferences = () => {
  const params: EntityViewerParams = useParams();

  const { entityId, genomeId } = params;

  const stableId = entityId ? parseEnsObjectIdFromUrl(entityId).objectId : null;

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

  const externalReferencesGroups = buildExternalReferencesGroups(
    data.gene.external_references
  );
  const { transcripts } = data.gene;

  return (
    <div className={styles.xrefsContainer}>
      <div className={styles.geneDetails}>
        <span className={styles.geneSymbol}>{data.gene.symbol}</span>
        <span>{data.gene.stable_id}</span>
      </div>

      <div className={styles.sectionHead}>Gene</div>
      {data.gene.external_references && renderXrefs(externalReferencesGroups)}
      {transcripts && (
        <div>
          <div className={styles.sectionHead}>Transcripts</div>
          {transcripts.map((transcript, key) => {
            return (
              <div key={key}>
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
  const transcriptsXrefGroups = buildExternalReferencesGroups(
    transcript.external_references
  );
  return (
    <div className={styles.transcriptWrapper}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.transcriptId}
      >
        {transcript.stable_id}
      </div>
      {transcript.external_references && isExpanded && (
        <div className={styles.transcriptXrefs}>
          {renderXrefs(transcriptsXrefGroups)}
        </div>
      )}
    </div>
  );
};

const renderXrefs = (xrefGroups: {
  [key: string]: ExternalReferencesGroup;
}) => {
  return Object.values(xrefGroups).map((externalReferencesGroup, key) => {
    if (externalReferencesGroup.references.length === 1) {
      return (
        <div key={key}>
          <ExternalReference
            label={externalReferencesGroup.source.name}
            to={externalReferencesGroup.references[0].url}
            linkText={externalReferencesGroup.references[0].accession_id}
            classNames={{
              container: styles.externalReferenceContainer
            }}
          />
        </div>
      );
    } else {
      return renderXrefGroup(externalReferencesGroup, key);
    }
  });
};

const renderXrefGroup = (
  externalReferencesGroup: ExternalReferencesGroup,
  key: number
) => {
  return (
    <div className={styles.accordionContainer} key={key}>
      <Accordion className={styles.xrefAccordion}>
        <AccordionItem className={styles.xrefAccordionItem}>
          <AccordionItemHeading className={styles.xrefAccordionHeader}>
            <AccordionItemButton className={styles.xrefAccordionButton}>
              {externalReferencesGroup.source.name}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.xrefAccordionItemContent}>
            <div>
              {externalReferencesGroup.references.map((entry, key) => (
                <ExternalReference
                  label={
                    entry.description === entry.accession_id ||
                    externalReferencesGroup.source.name === entry.description
                      ? ''
                      : entry.description
                  }
                  to={entry.url}
                  linkText={entry.accession_id}
                  key={key}
                  classNames={{
                    container: styles.externalReferenceContainer
                  }}
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
