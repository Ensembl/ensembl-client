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
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router';
import sortBy from 'lodash/sortBy';
import { Pick2 } from 'ts-multipick';

import { parseEnsObjectIdFromUrl } from 'src/shared/state/ens-object/ensObjectHelpers';
import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';

import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

import {
  ExternalReference as ExternalReferenceType,
  ExternalReferencesGroup as ExternalReferencesGroupType
} from 'src/shared/types/thoas/externalReference';
import { EntityViewerParams } from 'src/content/app/entity-viewer/EntityViewer';
import { Slice } from 'src/shared/types/thoas/slice';
import { FullProductGeneratingContext } from 'src/shared/types/thoas/productGeneratingContext';
import { TranscriptMetadata } from 'src/shared/types/thoas/metadata';
import { SidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import styles from './GeneExternalReferences.scss';

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
        }
      }
      transcripts {
        stable_id
        slice {
          location {
            length
          }
        }
        external_references {
          accession_id
          name
          description
          url
          source {
            id
            name
          }
        }
        product_generating_contexts {
          product_type
          product {
            external_references {
              accession_id
              name
              description
              url
              source {
                id
                name
              }
            }
          }
        }
        metadata {
          canonical {
            value
          }
          mane {
            value
          }
        }
      }
    }
  }
`;

type Transcript = {
  stable_id: string;
  slice: Pick2<Slice, 'location', 'length'>;
  product_generating_contexts: Array<
    Pick<FullProductGeneratingContext, 'product_type'> & {
      product: { external_references: ExternalReferenceType[] } | null;
    }
  >;
  external_references: ExternalReferenceType[];
  metadata: Pick<TranscriptMetadata, 'canonical' | 'mane'>;
};

type Gene = {
  symbol: string;
  stable_id: string;
  transcripts: Transcript[];
  external_references: ExternalReferenceType[];
};

const GeneExternalReferences = () => {
  const params: EntityViewerParams = useParams();
  const { entityId, genomeId } = params;
  const stableId = entityId ? parseEnsObjectIdFromUrl(entityId).objectId : null;

  const { trackExternalReferenceLinkClick } = useEntityViewerAnalytics();

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
  const sortedTranscripts = defaultSort(transcripts);

  const externalReferenceClickHandler = (linkLabel: string) => {
    trackExternalReferenceLinkClick({
      tabName: SidebarTabName.EXTERNAL_REFERENCES,
      linkLabel
    });
  };

  return (
    <div>
      <section>
        <div className={styles.sectionContent}>
          <span className={styles.geneSymbol}>{data.gene.symbol}</span>
          <span>{data.gene.stable_id}</span>
        </div>
      </section>
      <section>
        <div className={styles.sectionHead}>Gene</div>
        {data.gene.external_references && (
          <div className={styles.sectionContent}>
            {renderExternalReferencesGroups(
              externalReferencesGroups,
              externalReferenceClickHandler
            )}
          </div>
        )}
      </section>
      {sortedTranscripts.length && (
        <section>
          <div className={styles.sectionHead}>Transcripts</div>
          <div className={styles.sectionContent}>
            {sortedTranscripts.map((transcript, key) => {
              return (
                <div key={key}>
                  <TranscriptExternalReferencesGroups
                    transcript={transcript}
                    externalReferenceClickHandler={
                      externalReferenceClickHandler
                    }
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

const TranscriptExternalReferencesGroups = (props: {
  transcript: Transcript;
  externalReferenceClickHandler: (linkLabel: string) => void;
}) => {
  const { transcript } = props;
  const unsortedExternalReferences = [...transcript.external_references];
  const [isTranscriptOpen, setTranscriptOpen] = useState(false);

  const toggleTranscript = () => setTranscriptOpen(!isTranscriptOpen);

  // Add protein level external references
  transcript.product_generating_contexts.forEach(
    (product_generating_context) => {
      product_generating_context.product &&
        unsortedExternalReferences.push(
          ...product_generating_context.product.external_references
        );
    }
  );

  const shouldRenderExternalReferences =
    isTranscriptOpen && transcript.external_references;

  const externalReferencesGroups = buildExternalReferencesGroups(
    unsortedExternalReferences
  );

  return (
    <>
      <ShowHide
        classNames={{ wrapper: styles.showHideWrapper }}
        onClick={toggleTranscript}
        isExpanded={isTranscriptOpen}
        label={transcript.stable_id}
      />
      {shouldRenderExternalReferences && (
        <div className={styles.listContainer}>
          {renderExternalReferencesGroups(
            externalReferencesGroups,
            props.externalReferenceClickHandler
          )}
        </div>
      )}
    </>
  );
};

const ExternalReferencesGroup = (props: {
  externalReferencesGroup: ExternalReferencesGroupType;
}) => {
  const [isExternalReferencesGroupOpen, setExternalReferencesGroupOpen] =
    useState(false);

  const toggleExternalReferencesGroup = () =>
    setExternalReferencesGroupOpen(!isExternalReferencesGroupOpen);

  const { references, source } = props.externalReferencesGroup;
  const externalReferencesList = references.map((entry, key) => (
    <ExternalReference
      label={
        entry.description === entry.accession_id ||
        source.name === entry.description
          ? ''
          : entry.description
      }
      to={entry.url}
      linkText={entry.accession_id}
      key={key}
      classNames={{
        container: styles.externalReferenceContainer,
        link: styles.externalReferenceLink
      }}
    />
  ));

  return (
    <>
      <ShowHide
        classNames={{ wrapper: styles.showHideWrapper }}
        onClick={toggleExternalReferencesGroup}
        isExpanded={isExternalReferencesGroupOpen}
        label={source.name}
      />
      {isExternalReferencesGroupOpen && (
        <div className={styles.listContainer}>{externalReferencesList}</div>
      )}
    </>
  );
};

const buildExternalReferencesGroups = (
  externalReferences: ExternalReferenceType[]
) => {
  const externalReferencesGroups: {
    [key: string]: ExternalReferencesGroupType;
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

  // Sort the external references within each group based on description (or accession_id when description is empty)
  Object.keys(externalReferencesGroups).forEach((sourceId) => {
    externalReferencesGroups[sourceId].references = sortBy(
      externalReferencesGroups[sourceId].references,
      (reference) => reference.description || reference.accession_id
    );
  });

  return externalReferencesGroups;
};

const renderExternalReferencesGroups = (
  externalReferencesGroups: {
    [key: string]: ExternalReferencesGroupType;
  },
  externalReferenceClickHandler: (linkLabel: string) => void
) => {
  return Object.values(externalReferencesGroups).map(
    (externalReferencesGroup, key) => (
      <div key={key}>
        {externalReferencesGroup.references.length === 1 ? (
          <ExternalReference
            label={externalReferencesGroup.source.name}
            to={externalReferencesGroup.references[0].url}
            linkText={externalReferencesGroup.references[0].accession_id}
            onClick={() =>
              externalReferenceClickHandler(externalReferencesGroup.source.name)
            }
            classNames={{
              container: styles.externalReferenceContainer,
              link: styles.externalReferenceLink
            }}
          />
        ) : (
          <ExternalReferencesGroup
            externalReferencesGroup={externalReferencesGroup}
          />
        )}
      </div>
    )
  );
};

export default GeneExternalReferences;
