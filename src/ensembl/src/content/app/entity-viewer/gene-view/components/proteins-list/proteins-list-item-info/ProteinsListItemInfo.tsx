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
import { useParams } from 'react-router-dom';
import set from 'lodash/fp/set';

import { CircleLoader } from 'src/shared/components/loader/Loader';
import { PrimaryButton } from 'src/shared/components/button/Button';
import ProteinDomainImage from 'src/content/app/entity-viewer/gene-view/components/protein-domain-image/ProteinDomainImage';
import ProteinImage from 'src/content/app/entity-viewer/gene-view/components/protein-image/ProteinImage';
import ProteinFeaturesCount from 'src/content/app/entity-viewer/gene-view/components/protein-features-count/ProteinFeaturesCount';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import InstantDownloadProtein from 'src/shared/components/instant-download/instant-download-protein/InstantDownloadProtein';

import {
  ExternalSource,
  externalSourceLinks
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { fetchProteinDomains } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';
import {
  fetchProteinSummaryStats,
  ProteinStats
} from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/proteinData';

import { LoadingState } from 'src/shared/types/loading-state';
import { Transcript } from 'src/shared/types/thoas/transcript';
import { ProteinDomain } from 'src/shared/types/thoas/product';

import { SWISSPROT_SOURCE } from '../protein-list-constants';

import styles from './ProteinsListItemInfo.scss';
import settings from 'src/content/app/entity-viewer/gene-view/styles/_constants.scss';

type Props = {
  transcript: Transcript;
  trackLength: number;
};

const gene_image_width = Number(settings.gene_image_width);

const addProteinDomains = (
  transcript: Transcript,
  proteinDomains: ProteinDomain[]
) => {
  return set(
    ['product_generating_contexts', '0', 'product', 'protein_domains'],
    proteinDomains,
    transcript
  );
};

const ProteinsListItemInfo = (props: Props) => {
  const { transcript, trackLength } = props;
  const params: { [key: string]: string } = useParams();
  const { genomeId } = params;

  const [
    transcriptWithProteinDomains,
    setTranscriptWithProteinDomains
  ] = useState<Transcript | null>(null);

  const [proteinSummaryStats, setProteinSummaryStats] = useState<
    ProteinStats | null | undefined
  >();

  const [domainsLoadingState, setDomainsLoadingState] = useState<LoadingState>(
    LoadingState.LOADING
  );

  const [summaryStatsLoadingState, setSummaryStatsLoadingState] = useState<
    LoadingState
  >(LoadingState.LOADING);

  const proteinId =
    transcript.product_generating_contexts[0].product.unversioned_stable_id;

  const { product } =
    transcriptWithProteinDomains?.product_generating_contexts[0] || {};

  const uniprotXref = product?.external_references.find(
    (xref) => xref.source.id === SWISSPROT_SOURCE
  );

  useEffect(() => {
    const abortController = new AbortController();

    if (domainsLoadingState === LoadingState.LOADING) {
      fetchProteinDomains(proteinId, abortController.signal)
        .then((proteinDomains) => {
          if (!abortController.signal.aborted) {
            setTranscriptWithProteinDomains(
              addProteinDomains(transcript, proteinDomains)
            );
            setDomainsLoadingState(LoadingState.SUCCESS);
          }
        })
        .catch(() => {
          setDomainsLoadingState(LoadingState.ERROR);
        });
    }

    return function cleanup() {
      abortController.abort();
    };
  }, [domainsLoadingState]);

  useEffect(() => {
    const abortController = new AbortController();
    if (domainsLoadingState === LoadingState.SUCCESS && !uniprotXref) {
      setSummaryStatsLoadingState(LoadingState.SUCCESS);
      return;
    }

    if (domainsLoadingState === LoadingState.SUCCESS && uniprotXref) {
      fetchProteinSummaryStats(uniprotXref.accession_id, abortController.signal)
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
  }, [domainsLoadingState, uniprotXref]);

  return (
    <div className={styles.proteinsListItemInfo}>
      {product && (
        <>
          <ProteinDomainImage
            proteinDomains={product.protein_domains}
            trackLength={trackLength}
            width={gene_image_width}
          />
          <ProteinImage
            product={product}
            trackLength={trackLength}
            width={gene_image_width}
          />
        </>
      )}

      <div className={styles.proteinSummary}>
        <>
          <div className={styles.proteinSummaryTop}>
            {uniprotXref && (
              <div className={styles.interproUniprotWrapper}>
                <ProteinExternalReference
                  source={ExternalSource.INTERPRO}
                  accessionId={uniprotXref.accession_id}
                  name={uniprotXref.name}
                />
                <ProteinExternalReference
                  source={ExternalSource.UNIPROT}
                  accessionId={uniprotXref.accession_id}
                  name={uniprotXref.name}
                />
              </div>
            )}
            <div className={styles.downloadWrapper}>
              <InstantDownloadProtein
                genomeId={genomeId}
                transcriptId={transcript.unversioned_stable_id}
              />
            </div>
          </div>
          {proteinSummaryStats && uniprotXref && (
            <div>
              <ProteinExternalReference
                source={ExternalSource.PDBE}
                accessionId={uniprotXref.accession_id}
                name={uniprotXref.name}
              />
              {proteinSummaryStats && (
                <div className={styles.proteinFeaturesCountWrapper}>
                  <ProteinFeaturesCount proteinStats={proteinSummaryStats} />
                </div>
              )}
            </div>
          )}
        </>
        <StatusContent
          summaryLoadingState={summaryStatsLoadingState}
          domainsLoadingState={domainsLoadingState}
          setSummaryStatsLoadingState={setSummaryStatsLoadingState}
          setDomainsLoadingState={setDomainsLoadingState}
        />

        <div className={styles.keyline}></div>
      </div>
    </div>
  );
};

type StatusContentProps = {
  summaryLoadingState: LoadingState;
  domainsLoadingState: LoadingState;
  setSummaryStatsLoadingState: (loadingState: LoadingState) => void;
  setDomainsLoadingState: (loadingState: LoadingState) => void;
};

const StatusContent = (props: StatusContentProps) => {
  if (
    props.domainsLoadingState === LoadingState.LOADING ||
    props.summaryLoadingState === LoadingState.LOADING
  ) {
    return (
      <div className={styles.statusContainer}>
        <CircleLoader />
      </div>
    );
  }

  const retryHandler = () => {
    if (props.domainsLoadingState === LoadingState.ERROR) {
      props.setDomainsLoadingState(LoadingState.LOADING);
    }
    if (props.summaryLoadingState === LoadingState.ERROR) {
      props.setSummaryStatsLoadingState(LoadingState.LOADING);
    }
  };

  return props.domainsLoadingState === LoadingState.ERROR ||
    props.summaryLoadingState === LoadingState.ERROR ? (
    <div className={styles.statusContainer}>
      <span className={styles.errorMessage}>
        Failed to get data from PDBe Knowledge Base.
      </span>
      <PrimaryButton onClick={retryHandler}>Try again</PrimaryButton>
    </div>
  ) : null;
};

type ProteinExternalReferenceProps = {
  source: ExternalSource;
  accessionId: string;
  name: string;
};

const ProteinExternalReference = (props: ProteinExternalReferenceProps) => {
  const url = `${externalSourceLinks[props.source]}${props.accessionId}`;

  return (
    <div className={styles.proteinExternalReference}>
      <ExternalReference label={props.source} to={url} linkText={props.name} />
    </div>
  );
};

export default ProteinsListItemInfo;
