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
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { useAppDispatch } from 'src/store';
import useGeneViewIds from 'src/content/app/entity-viewer/gene-view/hooks/useGeneViewIds';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import {
  isProteinCodingTranscript,
  getFeatureCoordinates,
  getRegionName,
  getNumberOfCodingExons,
  getSplicedRNALength,
  getProductAminoAcidLength
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import { getTranscriptMetadata } from 'src/content/app/entity-viewer/shared/components/default-transcript-label/TranscriptQualityLabel';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import { TrackTranscriptDownloadPayload } from 'src/shared/components/instant-download/instant-download-transcript/InstantDownloadTranscript';

import {
  toggleTranscriptDownload,
  toggleTranscriptMoreInfo
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import { View } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';
import type { DefaultEntityViewerGeneQueryResult } from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';

import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';

import transcriptsListStyles from '../DefaultTranscriptsList.scss';
import styles from './TranscriptsListItemInfo.scss';

export type TranscriptsListItemInfoProps = {
  gene: DefaultEntityViewerGeneQueryResult['gene'];
  transcript: DefaultEntityViewerGeneQueryResult['gene']['transcripts'][number];
  expandDownload: boolean;
  expandMoreInfo: boolean;
};

export const TranscriptsListItemInfo = (
  props: TranscriptsListItemInfoProps
) => {
  const { activeGenomeId, genomeIdInUrl, entityIdInUrl } = useGeneViewIds();
  const { transcript } = props;

  const dispatch = useAppDispatch();

  const {
    trackTranscriptMoreInfoToggle,
    trackExternalLinkClickInTranscriptList,
    trackInstantDownloadTranscriptList
  } = useEntityViewerAnalytics();

  const handleTranscriptMoreInfoClick = () => {
    dispatch(toggleTranscriptMoreInfo(transcript.stable_id));

    const qualityLabel = getTranscriptMetadata(transcript)?.label;
    trackTranscriptMoreInfoToggle(qualityLabel, transcript.stable_id);
  };

  const onDownload = (
    payload: TrackTranscriptDownloadPayload,
    downloadStatus: 'success' | 'failure'
  ) => {
    const geneDownloadOptions = Object.entries(payload.options.gene)
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => `gene_${key}`);

    const transcriptDownloadOptions = Object.entries(payload.options.transcript)
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => `transcript_${key}`);

    trackInstantDownloadTranscriptList({
      geneSymbol: props.gene.symbol ?? props.gene.stable_id,
      transcriptId: payload.transcriptId,
      options: [...geneDownloadOptions, ...transcriptDownloadOptions],
      downloadStatus
    });
  };

  const handleExternalReferenceClick = (linkLabel: string) => {
    trackExternalLinkClickInTranscriptList(linkLabel);
  };

  const getTranscriptLocation = () => {
    const { start, end } = getFeatureCoordinates(transcript);
    const chromosome = getRegionName(transcript);

    return getFormattedLocation({
      chromosome,
      start,
      end
    });
  };

  const splicedRNALength = getCommaSeparatedNumber(
    getSplicedRNALength(transcript)
  );

  const aminoAcidLength = getCommaSeparatedNumber(
    getProductAminoAcidLength(transcript)
  );

  const mainStyles = classNames(transcriptsListStyles.row, styles.listItemInfo);
  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);
  const transcriptCCDS = transcript.external_references.find(
    (xref) => xref.source.name === 'CCDS'
  );
  const transcriptNCBI = transcript.metadata.mane?.ncbi_transcript;

  const hasRelevantMetadata = (
    ['gencode_basic', 'tsl', 'appris'] as const
  ).some((key) => transcript.metadata[key]);

  const focusIdForUrl = buildFocusIdForUrl({
    type: 'gene',
    objectId: props.gene.unversioned_stable_id
  });

  const getLinkToProteinView = (proteinStableId: string) => {
    const proteinViewUrl = urlFor.entityViewer({
      genomeId: genomeIdInUrl,
      entityId: entityIdInUrl,
      view: View.PROTEIN,
      proteinId: proteinStableId
    });

    return <Link to={proteinViewUrl}>{proteinStableId}</Link>;
  };

  const getBrowserLink = () => {
    return urlFor.browser({ genomeId: genomeIdInUrl, focus: focusIdForUrl });
  };

  const handleDownloadLinkClick = () => {
    dispatch(toggleTranscriptDownload(transcript.stable_id));
  };

  const moreInfoContent = () => {
    return (
      <>
        {hasRelevantMetadata && (
          <div className={styles.moreInfoColumn}>
            {transcript.metadata.gencode_basic?.label && (
              <div>{transcript.metadata.gencode_basic?.label}</div>
            )}
            {transcript.metadata?.tsl && (
              <div>{transcript.metadata.tsl?.label}</div>
            )}
            {transcript.metadata?.appris && (
              <div>{transcript.metadata.appris?.label}</div>
            )}
          </div>
        )}
        {(!!transcriptCCDS || !!transcriptNCBI) && (
          <div className={styles.moreInfoColumn}>
            {!!transcriptNCBI && (
              <ExternalReference
                classNames={{
                  link: styles.externalRefLink
                }}
                label={'RefSeq match'}
                to={transcriptNCBI.url}
                linkText={transcriptNCBI.id}
                onClick={() => handleExternalReferenceClick('RefSeq match')}
              />
            )}
            {!!transcriptCCDS?.url && (
              <ExternalReference
                classNames={{
                  link: styles.externalRefLink
                }}
                label={'CCDS'}
                to={transcriptCCDS.url}
                linkText={transcriptCCDS.accession_id}
                onClick={() => handleExternalReferenceClick('CCDS')}
              />
            )}
          </div>
        )}
      </>
    );
  };

  const product = transcript.product_generating_contexts[0].product;
  return (
    <div className={mainStyles}>
      <div className={transcriptsListStyles.left}></div>
      <div className={midStyles}>
        <div className={styles.topLeft}>
          <div>
            Biotype{' '}
            <span className={styles.normalText}>
              {transcript.metadata.biotype.label}
            </span>
          </div>
          <div>{getTranscriptLocation()}</div>
        </div>
        <div className={styles.topMiddle}>
          {isProteinCodingTranscript(transcript) && (
            <>
              <div className={styles.normalText} data-test-id="proteinLength">
                {aminoAcidLength} aa
              </div>
              <div className={styles.normalText}>
                {product && getLinkToProteinView(product?.stable_id)}
              </div>
            </>
          )}
        </div>
        <div className={styles.topRight}>
          <div>
            Combined exon length{' '}
            <span className={styles.normalText}>{splicedRNALength}</span> bp
          </div>
          <div>
            Coding exons{' '}
            <span className={styles.normalText}>
              {getNumberOfCodingExons(transcript)}
            </span>{' '}
            of {transcript.spliced_exons.length}
          </div>
        </div>

        {(hasRelevantMetadata || !!transcriptCCDS) && (
          <ShowHide
            onClick={handleTranscriptMoreInfoClick}
            label="More information"
            isExpanded={props.expandMoreInfo}
            className={styles.moreInformationLink}
          />
        )}

        {props.expandMoreInfo && (
          <div className={styles.moreInformation}>{moreInfoContent()}</div>
        )}

        <ShowHide
          onClick={handleDownloadLinkClick}
          label="Download"
          isExpanded={props.expandDownload}
          className={styles.downloadLink}
        />
        {props.expandDownload && (
          <div className={styles.download}>
            <InstantDownloadTranscript
              genomeId={activeGenomeId as string}
              transcript={{
                id: transcript.stable_id,
                isProteinCoding: isProteinCodingTranscript(transcript)
              }}
              gene={{ id: props.gene.stable_id }}
              onDownloadSuccess={(payload) => onDownload(payload, 'success')}
              onDownloadFailure={(payload) => onDownload(payload, 'failure')}
            />
          </div>
        )}
      </div>
      <div className={transcriptsListStyles.right}>
        <div className={styles.viewInApp}>
          <ViewInApp
            theme="dark"
            links={{ genomeBrowser: { url: getBrowserLink() } }}
          />
        </div>
      </div>
    </div>
  );
};

export default TranscriptsListItemInfo;
