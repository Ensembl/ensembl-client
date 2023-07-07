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

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Pick2 } from 'ts-multipick';

import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';
import { useProteinDomainsQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import { getEntityViewerActiveGenomeId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import { CircleLoader } from 'src/shared/components/loader';
import ProteinDomainImage from 'src/content/app/entity-viewer/gene-view/components/protein-domain-image/ProteinDomainImage';
import ProteinImage from 'src/content/app/entity-viewer/gene-view/components/protein-image/ProteinImage';
import ProteinFeaturesCount from 'src/content/app/entity-viewer/gene-view/components/protein-features-count/ProteinFeaturesCount';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import InstantDownloadProtein, {
  OnDownloadPayload
} from 'src/shared/components/instant-download/instant-download-protein/InstantDownloadProtein';
import Chevron from 'src/shared/components/chevron/Chevron';

import {
  ExternalSource,
  externalSourceLinks,
  getProteinXrefs
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import {
  fetchProteinSummaryStats,
  ProteinStats
} from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/proteinData';

import { SWISSPROT_SOURCE } from 'src/content/app/entity-viewer/gene-view/components/proteins-list/protein-list-constants';

import { LoadingState } from 'src/shared/types/loading-state';
import type { ExternalReference as ExternalReferenceType } from 'src/shared/types/core-api/externalReference';
import type { DefaultEntityViewerGeneQueryResult } from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';
import type { ProteinCodingTranscript } from 'src/content/app/entity-viewer/gene-view/components/proteins-list/ProteinsList';

import styles from './ProteinsListItemInfo.scss';
import settings from 'src/content/app/entity-viewer/gene-view/styles/_constants.scss';

export type Props = {
  gene: DefaultEntityViewerGeneQueryResult['gene'];
  transcript: ProteinCodingTranscript;
  trackLength: number;
};

const gene_image_width = Number(settings.gene_image_width);

const ProteinsListItemInfo = (props: Props) => {
  const { gene, transcript, trackLength } = props;
  const genomeId = useSelector(getEntityViewerActiveGenomeId);

  const [proteinSummaryStats, setProteinSummaryStats] = useState<
    ProteinStats | null | undefined
  >();

  const [summaryStatsLoadingState, setSummaryStatsLoadingState] =
    useState<LoadingState>(LoadingState.LOADING);

  const { trackProteinDownload } = useEntityViewerAnalytics();

  const productId = transcript.product_generating_contexts[0].product.stable_id;

  const proteinXrefs = getProteinXrefs(transcript);
  const displayXref = proteinXrefs[0];

  const { currentData } = useProteinDomainsQuery({
    productId: productId,
    genomeId: genomeId as string
  });

  useEffect(() => {
    const abortController = new AbortController();
    if (summaryStatsLoadingState === LoadingState.LOADING && !displayXref) {
      // if displayXref is absent, we cannot fetch relevant data from PDBe; so pretend that we've successfully completed the request
      setSummaryStatsLoadingState(LoadingState.SUCCESS);
      return;
    }

    if (summaryStatsLoadingState === LoadingState.LOADING && displayXref) {
      fetchProteinSummaryStats(displayXref.accession_id, abortController.signal)
        .then((response) => {
          if (!abortController.signal.aborted) {
            response
              ? setProteinSummaryStats(response as ProteinStats)
              : setProteinSummaryStats(null);
            setSummaryStatsLoadingState(LoadingState.SUCCESS);
          }
        })
        .catch(() => {
          setSummaryStatsLoadingState(LoadingState.ERROR);
        });
    }

    return function cleanup() {
      abortController.abort();
    };
  }, [summaryStatsLoadingState, displayXref]);

  const onDownload = (
    payload: OnDownloadPayload,
    downloadStatus: 'success' | 'failure'
  ) => {
    const downloadOptions = Object.entries(payload.options)
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => `transcript_${key}`);

    trackProteinDownload({
      geneSymbol: gene.symbol ?? gene.stable_id,
      transcriptId: payload.transcriptId,
      options: downloadOptions,
      downloadStatus
    });
  };

  const showLoadingIndicator =
    summaryStatsLoadingState === LoadingState.LOADING;

  return (
    <div className={styles.proteinsListItemInfo}>
      {currentData && (
        <>
          <ProteinDomainImage
            proteinDomains={currentData.product.family_matches}
            trackLength={trackLength}
            width={gene_image_width}
          />
          <ProteinImage
            proteinLength={currentData.product.length}
            trackLength={trackLength}
            width={gene_image_width}
          />
        </>
      )}

      <div className={styles.proteinSummary}>
        <>
          <div className={styles.proteinSummaryTop}>
            {proteinXrefs.length > 0 && (
              <div>
                <div className={styles.xrefsWrapper}>
                  <ProteinExternalReferenceGroup
                    source={
                      proteinXrefs[0].source.id === SWISSPROT_SOURCE
                        ? ExternalSource.UNIPROT_SWISSPROT
                        : ExternalSource.UNIPROT_TREMBL
                    }
                    xrefs={proteinXrefs}
                  />
                </div>
                <div className={styles.xrefsWrapper}>
                  <ProteinExternalReferenceGroup
                    source={ExternalSource.INTERPRO}
                    xrefs={proteinXrefs}
                  />
                </div>
              </div>
            )}
            {
              <div className={styles.downloadWrapper}>
                <InstantDownloadProtein
                  genomeId={genomeId as string}
                  transcriptId={transcript.unversioned_stable_id}
                  onDownloadSuccess={(payload) =>
                    onDownload(payload, 'success')
                  }
                  onDownloadFailure={(payload) =>
                    onDownload(payload, 'failure')
                  }
                />
              </div>
            }
          </div>
          {proteinSummaryStats && (
            <div className={styles.proteinStatsWrapper}>
              <ProteinExternalReference
                source={ExternalSource.PDBE}
                accessionId={displayXref.accession_id}
                name={displayXref.name}
              />
              <div className={styles.proteinFeaturesCountWrapper}>
                <ProteinFeaturesCount proteinStats={proteinSummaryStats} />
              </div>
            </div>
          )}
        </>
        {showLoadingIndicator && (
          <div className={styles.statusContainer}>
            <CircleLoader />
          </div>
        )}
        <div className={styles.keyline}></div>
      </div>
    </div>
  );
};

type ProteinExternalReferenceProps = {
  source: ExternalSource;
  accessionId: string;
  name: string;
};

const ProteinExternalReference = (props: ProteinExternalReferenceProps) => {
  const url = `${externalSourceLinks[props.source]}${props.accessionId}`;

  const { trackExternalLinkClickInProteinsList } = useEntityViewerAnalytics();

  const onClick = () => {
    trackExternalLinkClickInProteinsList(props.source);
  };

  return (
    <div className={styles.proteinExternalReference}>
      <ExternalReference
        classNames={{
          container: styles.externalRefContainer,
          link: styles.externalRefLink
        }}
        label={props.source}
        to={url}
        linkText={props.accessionId}
        onClick={onClick}
      />
    </div>
  );
};

type ProteinExternalReferenceGroupProps = {
  source: ExternalSource;
  xrefs: Array<
    Pick<ExternalReferenceType, 'accession_id' | 'name'> &
      Pick2<ExternalReferenceType, 'source', 'id'>
  >;
};

export const ProteinExternalReferenceGroup = (
  props: ProteinExternalReferenceGroupProps
) => {
  const { source, xrefs } = props;

  const [isXrefGroupOpen, setXrefGroupOpen] = useState(false);

  const toggleXrefGroup = () => {
    setXrefGroupOpen(!isXrefGroupOpen);
  };

  if (xrefs.length > 3) {
    const displayXref = xrefs[0];
    return (
      <>
        <div className={styles.xrefWithChevron}>
          <ProteinExternalReference
            key={displayXref.accession_id}
            source={source}
            accessionId={displayXref.accession_id}
            name={displayXref.name}
          />
          <div className={styles.xrefGroupChevron} onClick={toggleXrefGroup}>
            <span
              className={
                isXrefGroupOpen ? styles.xrefCountChevronOpen : undefined
              }
            >
              + {xrefs.length - 1}
              <Chevron
                direction={isXrefGroupOpen ? 'up' : 'down'}
                animate={true}
                className={styles.chevron}
              />
            </span>
          </div>
        </div>
        {isXrefGroupOpen &&
          xrefs.slice(1).map((xref) => {
            return (
              <ProteinExternalReference
                key={xref.accession_id}
                source={source}
                accessionId={xref.accession_id}
                name={xref.name}
              />
            );
          })}
      </>
    );
  } else {
    return (
      <>
        {xrefs.map((xref) => {
          return (
            <ProteinExternalReference
              key={xref.accession_id}
              source={source}
              accessionId={xref.accession_id}
              name={xref.name}
            />
          );
        })}
      </>
    );
  }
};

export default ProteinsListItemInfo;
