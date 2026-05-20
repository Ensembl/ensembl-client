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

import { useState, useMemo } from 'react';
import sortBy from 'lodash/sortBy';

import { useTranscriptExternalReferencesQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

import type { QueriedExternalReference } from 'src/content/app/entity-viewer/state/api/queries/geneExternalReferencesQuery';

import styles from './SidebarExternalReferences.module.css';

type ExternalReferencesGroupType = {
  source: QueriedExternalReference['source'];
  references: Omit<QueriedExternalReference, 'source'>[];
};

const SidebarExternalReferences = ({
  genomeId,
  transcriptId
}: {
  genomeId: string;
  transcriptId: string;
}) => {
  const { currentData, isFetching } = useTranscriptExternalReferencesQuery({
    transcriptId: transcriptId,
    genomeId: genomeId
  });

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!currentData || !currentData.transcript) {
    return <div>No data to display</div>;
  }
  const { transcript } = currentData;
  const unsortedExternalReferences = [
    ...currentData.transcript.external_references
  ];

  // Add protein level external references
  transcript.product_generating_contexts.forEach(
    (product_generating_context) => {
      if (product_generating_context.product) {
        unsortedExternalReferences.push(
          ...product_generating_context.product.external_references
        );
      }
    }
  );

  const externalReferenceGroups = groupExternalReferences(
    unsortedExternalReferences
  );

  return (
    <div className={styles.container}>
      <ExternalReferencesGroups groups={externalReferenceGroups} />
    </div>
  );
};

const ExternalReferenceGroup = (props: {
  group: ExternalReferencesGroupType;
}) => {
  const [areReferencesVisible, setReferencesVisibility] = useState(false);

  const toggleExternalReferencesGroup = () =>
    setReferencesVisibility(!areReferencesVisible);

  const { references, source } = props.group;
  const externalReferenceList = useMemo(
    () =>
      references.map((reference) =>
        reference.url ? (
          <ExternalReference
            label={
              reference.description === reference.accession_id ||
              source.name === reference.description
                ? ''
                : reference.description
            }
            to={reference.url}
            key={reference.accession_id}
            className={styles.externalReference}
          >
            {reference.accession_id}
          </ExternalReference>
        ) : null
      ),
    [references, source.name]
  );

  return (
    <>
      <ShowHide
        className={styles.showHide}
        onClick={toggleExternalReferencesGroup}
        isExpanded={areReferencesVisible}
        label={source.name}
      />
      {areReferencesVisible && (
        <div className={styles.listContainer}>{externalReferenceList}</div>
      )}
    </>
  );
};

const groupExternalReferences = (
  externalReferences: QueriedExternalReference[]
) => {
  const groups: {
    [key: string]: ExternalReferencesGroupType;
  } = {};

  const sortedExternalReferences = sortBy(
    externalReferences,
    (reference) => reference.source.name
  );

  sortedExternalReferences.forEach((externalReference) => {
    const sourceId = externalReference.source.id;

    if (!groups[sourceId]) {
      groups[sourceId] = {
        source: externalReference.source,
        references: []
      };
    }

    groups[sourceId].references.push({
      accession_id: externalReference.accession_id,
      url: externalReference.url,
      name: externalReference.name,
      description: externalReference.description
    });
  });

  // Sort external references within each group based on their description
  // (or accession_id when description is empty)
  Object.values(groups).forEach((group) => {
    group.references = sortBy(
      group.references,
      (reference) => reference.description || reference.accession_id
    );
  });

  return groups;
};

const ExternalReferencesGroups = ({
  groups
}: {
  groups: {
    [key: string]: ExternalReferencesGroupType;
  };
}) => {
  return Object.values(groups).map((group, key) => (
    <div key={key}>
      {group.references.length === 1 ? (
        group.references[0].url ? (
          <ExternalReference
            label={group.source.name}
            to={group.references[0].url}
            className={styles.externalReference}
          >
            {group.references[0].accession_id}
          </ExternalReference>
        ) : null
      ) : (
        <ExternalReferenceGroup group={group} />
      )}
    </div>
  ));
};

export default SidebarExternalReferences;
