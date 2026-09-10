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

import { useState } from 'react';

import * as urlFor from 'src/shared/helpers/urlHelper';

import useGeneViewIds from 'src/content/app/entity-viewer/gene-view/hooks/useGeneViewIds';

import { useDefaultEntityViewerGeneQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';
import {
  isProteinCodingTranscript,
  getSplicedRNALength,
  getProductAminoAcidLength
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import {
  getCCDSXref,
  getNCBITranscriptData,
  getTranscriptBiotype,
  getTranscriptFlags,
  getUniprotXref
} from './transcriptTableHelpers';
import { downloadTextAsFile } from 'src/shared/helpers/downloadAsFile';
import { getDownloadableTranscriptTable } from './geneTranscriptsTableDownload';

import { Panel, PanelHead, PanelBody } from 'src/shared/components/panel/Panel';
import { Table, ColumnHead } from 'src/shared/components/table';
import { CircleLoader } from 'src/shared/components/loader';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import InfoPill from 'src/shared/components/info-pill/InfoPill';
import ViewInAppPopup from 'src/shared/components/view-in-app-popup/ViewInAppPopup';
import { ControlledDownloadButton } from 'src/shared/components/download-button/DownloadButton';

import { LoadingState } from 'src/shared/types/loading-state';

import type { DefaultEntityViewerTranscript } from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';

import styles from './GeneTranscriptsTable.module.css';

const GeneTranscriptsTable = () => {
  return (
    <Panel>
      <PanelHead className={styles.panelHead}>
        <span className={styles.selectedTab}>Proteins</span>
      </PanelHead>
      <PanelBody className={styles.panelBody}>
        <MainContent />
      </PanelBody>
    </Panel>
  );
};

const MainContent = () => {
  const { activeGenomeId, geneId, genomeIdForUrl } = useGeneViewIds();

  // FIXME: change the query to load all gene transcripts
  const { currentData, isFetching } = useDefaultEntityViewerGeneQuery(
    {
      geneId: geneId as string,
      genomeId: activeGenomeId as string
    },
    {
      skip: !geneId || !activeGenomeId
    }
  );

  if (isFetching) {
    return <CircleLoader />;
  }
  if (!currentData) {
    return null;
  }

  const gene = currentData.gene;
  const transcripts = gene.transcripts;

  return (
    <div className={styles.container}>
      <ControlsSection geneId={gene.stable_id} transcripts={transcripts} />
      <div className={styles.tableWrapper}>
        <Table stickyHeader={true} className={styles.table}>
          <thead>
            <tr>
              <ColumnHead>Transcript</ColumnHead>
              <ColumnHead>cDNA length</ColumnHead>
              <ColumnHead>Protein length</ColumnHead>
              <ColumnHead>Biotype</ColumnHead>
              <ColumnHead>CCDS</ColumnHead>
              <ColumnHead>UniProt match</ColumnHead>
              <ColumnHead>RefSeq match</ColumnHead>
              <ColumnHead>Flags</ColumnHead>
            </tr>
          </thead>
          <tbody>
            {transcripts.map((transcript) => (
              <tr key={transcript.stable_id}>
                <td>
                  <TranscriptStableId
                    genomeIdForUrl={genomeIdForUrl as string}
                    transcriptId={transcript.stable_id}
                  />
                </td>
                <td>{formatNumber(getSplicedRNALength(transcript))}</td>
                <td>
                  {isProteinCodingTranscript(transcript)
                    ? formatNumber(getProductAminoAcidLength(transcript))
                    : '—'}
                </td>
                <td>{getTranscriptBiotype(transcript)}</td>
                <td>
                  <CCDSLink transcript={transcript} />
                </td>
                <td>
                  <UniprotLink transcript={transcript} />
                </td>
                <td>
                  <RefSeqLink transcript={transcript} />
                </td>
                <td>
                  <TranscriptFlags transcript={transcript} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

const ControlsSection = ({
  transcripts,
  geneId
}: {
  geneId: string;
  transcripts: DefaultEntityViewerTranscript[];
}) => {
  const [buttonStatus, setButtonStatus] = useState(LoadingState.NOT_REQUESTED);
  const fileName = `${geneId} transcripts.csv`;

  const onDownloadClick = () => {
    const tableCSV = getDownloadableTranscriptTable({ transcripts });

    downloadTextAsFile(tableCSV, fileName);
    setButtonStatus(LoadingState.SUCCESS);

    setTimeout(() => {
      setButtonStatus(LoadingState.NOT_REQUESTED);
    }, 1000);
  };

  return (
    <div className={styles.controlsSection}>
      <ControlledDownloadButton
        onClick={onDownloadClick}
        status={buttonStatus}
      />
    </div>
  );
};

const TranscriptStableId = ({
  genomeIdForUrl,
  transcriptId
}: {
  genomeIdForUrl: string;
  transcriptId: string;
}) => {
  const focusIdForUrl = buildFocusIdForUrl({
    type: 'transcript',
    objectId: transcriptId
  });

  const genomeBrowserUrl = urlFor.browser({
    genomeId: genomeIdForUrl,
    focus: focusIdForUrl
  });

  const featureExplorerUrl = urlFor.entityViewer({
    genomeId: genomeIdForUrl,
    entityId: focusIdForUrl
  });

  return (
    <ViewInAppPopup
      links={{
        genomeBrowser: {
          url: genomeBrowserUrl
        },
        entityViewer: {
          url: featureExplorerUrl
        }
      }}
    >
      {transcriptId}
    </ViewInAppPopup>
  );
};

const CCDSLink = ({
  transcript
}: {
  transcript: Pick<DefaultEntityViewerTranscript, 'external_references'>;
}) => {
  const data = getCCDSXref(transcript);
  if (!data?.url) {
    return '—';
  }

  return (
    <ExternalLink to={data.url} nowrap={true}>
      <span className={styles.externalRefLink}>{data.accession_id}</span>
    </ExternalLink>
  );
};

const UniprotLink = ({
  transcript
}: {
  transcript: Parameters<typeof getUniprotXref>[0];
}) => {
  const data = getUniprotXref(transcript);
  if (!data?.url) {
    return '—';
  }

  return (
    <ExternalLink to={data.url} nowrap={true}>
      <span className={styles.externalRefLink}>{data.accession_id}</span>
    </ExternalLink>
  );
};

const RefSeqLink = ({
  transcript
}: {
  transcript: Parameters<typeof getNCBITranscriptData>[0];
}) => {
  const ncbiTranscript = getNCBITranscriptData(transcript);
  if (!ncbiTranscript?.url) {
    return '—';
  }

  return (
    <ExternalLink to={ncbiTranscript.url} nowrap={true}>
      <span className={styles.externalRefLink}>{ncbiTranscript.id}</span>
    </ExternalLink>
  );
};

const TranscriptFlags = ({
  transcript
}: {
  transcript: Pick<DefaultEntityViewerTranscript, 'metadata'>;
}) => {
  const flags = getTranscriptFlags(transcript);

  const flagElements = flags.map((flag) => (
    <InfoPill key={flag}>{flag}</InfoPill>
  ));

  return <div className={styles.transcriptFlags}>{flagElements}</div>;
};

export default GeneTranscriptsTable;
