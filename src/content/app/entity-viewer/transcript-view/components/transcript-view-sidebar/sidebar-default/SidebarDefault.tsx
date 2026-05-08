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

import classNames from 'classnames';

import { useAppDispatch } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getFeatureLength } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';

import { useDefaultEntityViewerTranscriptQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import { openSidebarModal } from 'src/content/app/entity-viewer/state/transcript-view/sidebar/transcriptViewSidebarSlice';

import SidebarSectionHeading from 'src/shared/components/sidebar-section-heading/SidebarSectionHeading';
import GeneName from 'src/shared/components/gene-name/GeneName';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import { SidebarLoader } from 'src/shared/components/loader';
import SearchButton from 'src/shared/components/search-button/SearchButton';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import type { DefaultEntityViewerTranscriptQueryResult } from 'src/content/app/entity-viewer/state/api/queries/transcriptDefaultQuery';

import styles from './SidebarDefault.module.css';

type Props = {
  genomeId: string;
  transcriptId: string;
};

const SidebarDefault = (props: Props) => {
  const { genomeIdForUrl } = useEntityViewerIds();
  const { currentData, isLoading } = useDefaultEntityViewerTranscriptQuery({
    genomeId: props.genomeId,
    transcriptId: props.transcriptId
  });

  if (isLoading) {
    return <SidebarLoader />;
  } else if (!currentData) {
    return null;
  }

  const transcript = currentData.transcript;
  const gene = transcript.gene;

  return (
    <>
      <div className={styles.sectionContent}>
        <div className={classNames(styles.row, styles.rowWithLabel)}>
          <span className={styles.label}>Transcript</span>
          <span className={styles.strong}>{transcript.stable_id}</span>
        </div>
        <div className={classNames(styles.row, styles.rowWithLabel)}>
          <span className={styles.label}>Biotype</span>
          <span>{transcript.metadata.biotype.label}</span>
        </div>
        <div className={classNames(styles.row, styles.rowWithLabel)}>
          <span className={styles.label}>Length</span>
          <span>{getFeatureLength(transcript)} bp</span>
        </div>
      </div>
      <SidebarSectionHeading>Gene</SidebarSectionHeading>
      <div className={styles.sectionContent}>
        <GeneName stable_id={gene.stable_id} symbol={gene.symbol} />
      </div>
      <GeneNameSection genomeId={genomeIdForUrl as string} gene={gene} />
      <SynonymsSection gene={gene} />
      <AttributesSection gene={gene} />
      <SearchButtonSection
        genomeId={genomeIdForUrl as string}
        transcriptId={props.transcriptId}
      />
    </>
  );
};

const GeneNameSection = ({
  genomeId,
  gene
}: {
  genomeId: string;
  gene: DefaultEntityViewerTranscriptQueryResult['transcript']['gene'];
}) => {
  if (!gene.name) {
    return null;
  }
  const url = gene.metadata.name?.url;
  const accessionId = gene.metadata.name?.accession_id;

  const geneFocusIdForUrl = buildFocusIdForUrl({
    objectId: gene.unversioned_stable_id,
    type: 'gene'
  });
  const linkToGenomeBrowser = urlFor.browser({
    genomeId: genomeId,
    focus: geneFocusIdForUrl
  });
  const linkToEntityViewer = urlFor.entityViewer({
    genomeId: genomeId,
    entityId: geneFocusIdForUrl
  });

  return (
    <>
      <SidebarSectionHeading>Gene name</SidebarSectionHeading>
      <div className={styles.sectionContent}>
        <div>
          <span>{gene.name}</span>
        </div>
        {url && accessionId && (
          <div>
            <ExternalLink to={url}>{accessionId}</ExternalLink>
          </div>
        )}

        <ViewInApp
          links={{
            genomeBrowser: { url: linkToGenomeBrowser },
            entityViewer: { url: linkToEntityViewer }
          }}
          theme="light"
          className={styles.viewInAppGene}
        />
      </div>
    </>
  );
};

const SynonymsSection = ({
  gene
}: {
  gene: DefaultEntityViewerTranscriptQueryResult['transcript']['gene'];
}) => {
  if (!gene.alternative_symbols.length) {
    return null;
  }

  return (
    <>
      <SidebarSectionHeading>Synonyms</SidebarSectionHeading>
      <div className={styles.sectionContent}>
        {gene.alternative_symbols.join(', ')}
      </div>
    </>
  );
};

const AttributesSection = ({
  gene
}: {
  gene: DefaultEntityViewerTranscriptQueryResult['transcript']['gene'];
}) => {
  return (
    <>
      <SidebarSectionHeading>Attributes</SidebarSectionHeading>
      <div className={classNames(styles.sectionContent, styles.rowWithLabel)}>
        <span className={styles.label}>Biotype</span>
        <span>{gene.metadata.biotype.value}</span>
      </div>
    </>
  );
};

const SearchButtonSection = ({
  genomeId,
  transcriptId
}: {
  genomeId: string;
  transcriptId: string;
}) => {
  const dispatch = useAppDispatch();

  const openSearch = () => {
    dispatch(
      openSidebarModal({
        genomeId,
        transcriptId,
        view: 'search'
      })
    );
  };

  return (
    <div
      className={classNames(styles.searchButtonSection, styles.sectionContent)}
    >
      <SearchButton
        onClick={openSearch}
        label="Find"
        className={styles.searchButton}
      />
    </div>
  );
};

export default SidebarDefault;
