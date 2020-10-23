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
import set from 'lodash/fp/set';

import { CircleLoader } from 'src/shared/components/loader/Loader';
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
  fetchProteinSummary,
  ProteinSummary
} from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/proteinData';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { ProteinDomain } from 'src/content/app/entity-viewer/types/product';

import styles from './ProteinsListItemInfo.scss';

type Props = {
  transcript: Transcript;
  trackLength: number;
};

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
  const [
    transcriptWithProteinDomains,
    setTranscriptWithProteinDomains
  ] = useState<Transcript | null>(null);
  const [proteinSummary, setProteinSummary] = useState<
    ProteinSummary | null | undefined
  >();

  const proteinId =
    transcript.product_generating_contexts[0].product.unversioned_stable_id;

  useEffect(() => {
    const abortController = new AbortController();
    fetchProteinDomains(proteinId, abortController.signal).then(
      (proteinDomains) => {
        if (!abortController.signal.aborted) {
          setTranscriptWithProteinDomains(
            addProteinDomains(transcript, proteinDomains)
          );
        }
      }
    );

    fetchProteinSummary(proteinId, abortController.signal).then(
      (proteinSummaryData) => {
        if (!abortController.signal.aborted) {
          proteinSummaryData
            ? setProteinSummary(proteinSummaryData)
            : setProteinSummary(null);
        }
      }
    );

    return function cleanup() {
      abortController.abort();
    };
  }, [transcript.stable_id]);

  const { product } =
    transcriptWithProteinDomains?.product_generating_contexts[0] || {};

  // FIXME: the 695 below is by now a very magic number (also exists in transcript images);
  // we need to move it to a constant
  return (
    <div className={styles.proteinsListItemInfo}>
      {product && (
        <>
          <ProteinDomainImage
            proteinDomains={product.protein_domains}
            trackLength={trackLength}
            width={695}
          />
          <ProteinImage
            product={product}
            trackLength={trackLength}
            width={695}
          />
        </>
      )}

      <div className={styles.proteinSummary}>
        {proteinSummary && (
          <>
            <div className={styles.proteinSummaryTop}>
              <div className={styles.interproUniprotWrapper}>
                <ProteinExternalReference
                  source={ExternalSource.INTERPRO}
                  externalId={proteinSummary.pdbeId}
                />
                <ProteinExternalReference
                  source={ExternalSource.UNIPROT}
                  externalId={proteinSummary.pdbeId}
                />
              </div>
              <div className={styles.downloadWrapper}>
                <InstantDownloadProtein
                  transcriptId={transcript.unversioned_stable_id}
                />
              </div>
            </div>
            <div>
              <ProteinExternalReference
                source={ExternalSource.PDBE}
                externalId={proteinSummary.pdbeId}
              />
              {proteinSummary?.proteinStats && (
                <div className={styles.proteinFeaturesCountWrapper}>
                  <ProteinFeaturesCount
                    proteinStats={proteinSummary.proteinStats}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {(!product || proteinSummary === undefined) && (
          <div className={styles.statsLoadingContainer}>
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
  externalId: string | undefined;
};

const ProteinExternalReference = (props: ProteinExternalReferenceProps) => {
  const url = `${externalSourceLinks[props.source]}${props.externalId}`;

  return props.externalId ? (
    <div className={styles.geneExternalReference}>
      <ExternalReference
        label={props.source}
        to={url}
        linkText={props.externalId}
      />
    </div>
  ) : null;
};

export default ProteinsListItemInfo;
