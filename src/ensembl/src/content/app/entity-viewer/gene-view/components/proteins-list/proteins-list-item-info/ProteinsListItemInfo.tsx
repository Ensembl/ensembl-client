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
import { fetchTranscript } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';
import {
  fetchProteinSummary,
  ProteinSummary
} from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/proteinData';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import styles from './ProteinsListItemInfo.scss';

type Props = {
  transcriptId: string;
  trackLength: number;
};

const ProteinsListItemInfo = (props: Props) => {
  const { transcriptId, trackLength } = props;
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [proteinSummary, setProteinSummary] = useState<ProteinSummary | null>(
    null
  );

  useEffect(() => {
    const abortController = new AbortController();

    Promise.all([
      fetchTranscript(props.transcriptId, abortController.signal),
      fetchProteinSummary(props.transcriptId, abortController.signal)
    ]).then(([transcriptData, proteinSummaryData]) => {
      transcriptData && setTranscript(transcriptData);
      proteinSummaryData && setProteinSummary(proteinSummaryData);
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [transcriptId]);

  return (
    <div className={styles.proteinsListItemInfo}>
      {transcript?.product ? (
        <>
          <ProteinDomainImage
            proteinDomains={transcript.product?.protein_domains_resources}
            trackLength={trackLength}
            width={695}
          />
          <ProteinImage
            product={transcript.product}
            trackLength={trackLength}
            width={695}
          />
          <div className={styles.proteinSummary}>
            <div className={styles.proteinSummaryTop}>
              {proteinSummary && (
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
              )}
              <div className={styles.downloadWrapper}>
                <InstantDownloadProtein transcriptId={transcript.id} />
              </div>
            </div>
            {proteinSummary && (
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
            )}
          </div>
        </>
      ) : (
        <div className={styles.loadingContainer}>
          <CircleLoader />
        </div>
      )}
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
