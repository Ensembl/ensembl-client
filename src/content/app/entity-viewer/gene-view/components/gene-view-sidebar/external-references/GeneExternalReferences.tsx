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
import { useParams } from 'react-router';
import sortBy from 'lodash/sortBy';

import { parseFocusObjectIdFromUrl } from 'src/shared/helpers/focusObjectHelpers';
import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import { useGeneExternalReferencesQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';

import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

import { SidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';
import type {
  QueriedExternalReference,
  QueriedTranscript
} from 'src/content/app/entity-viewer/state/api/queries/geneExternalReferencesQuery';

import styles from './GeneExternalReferences.scss';

type ExternalReferencesGroupType = {
  source: QueriedExternalReference['source'];
  references: Omit<QueriedExternalReference, 'source'>[];
};

const GeneExternalReferences = () => {
  const { entityId, genomeId } = useParams<'genomeId' | 'entityId'>();
  const geneId = entityId ? parseFocusObjectIdFromUrl(entityId).objectId : null;

  const { trackExternalReferenceLinkClick } = useEntityViewerAnalytics();

  const { currentData, isFetching } = useGeneExternalReferencesQuery(
    {
      geneId: geneId || '',
      genomeId: genomeId || ''
    },
    {
      skip: !geneId || !genomeId
    }
  );

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!currentData || !currentData.gene) {
    return <div>No data to display</div>;
  }

  const externalReferencesGroups = buildExternalReferencesGroups(
    currentData.gene.external_references
  );
  const { transcripts } = currentData.gene;
  const sortedTranscripts = defaultSort(transcripts);

  const clickHandler = (linkLabel: string) => {
    trackExternalReferenceLinkClick({
      tabName: SidebarTabName.EXTERNAL_REFERENCES,
      linkLabel
    });
  };

  return (
    <div>
      <section>
        <div className={styles.sectionContent}>
          <span className={styles.geneSymbol}>{currentData.gene.symbol}</span>
          <span>{currentData.gene.stable_id}</span>
        </div>
      </section>
      <section>
        <div className={styles.sectionHead}>Gene</div>
        {currentData.gene.external_references && (
          <div className={styles.sectionContent}>
            {renderExternalReferencesGroups(
              externalReferencesGroups,
              clickHandler
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
                    onClick={clickHandler}
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
  transcript: QueriedTranscript;
  onClick: (linkLabel: string) => void;
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
            props.onClick
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
  externalReferences: QueriedExternalReference[]
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
  onClick: (linkLabel: string) => void
) => {
  return Object.values(externalReferencesGroups).map(
    (externalReferencesGroup, key) => (
      <div key={key}>
        {externalReferencesGroup.references.length === 1 ? (
          <ExternalReference
            label={externalReferencesGroup.source.name}
            to={externalReferencesGroup.references[0].url}
            linkText={externalReferencesGroup.references[0].accession_id}
            onClick={() => onClick(externalReferencesGroup.source.name)}
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
