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

import ProteinDomainImage from 'src/content/app/entity-viewer/gene-view/components/protein-domain-image/ProteinDomainImage';
import ProteinFeaturesCount from 'src/content/app/entity-viewer/gene-view/components/protein-features-count/ProteinFeaturesCount';

import {
  ExternalSource,
  externalSourceLinks
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import {
  fetchProteinSummaryStats,
  ProteinSummary
} from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/proteinData';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import styles from './ProteinsListItemInfo.scss';

type Props = {
  transcript: Transcript;
};

// TODO:
// the data fetching is temporary till the collapsed exons image PR is merged
// once it is merged then the refactoring can begin and data fetching can be more streamlined
const ProteinsListItemInfo = (props: Props) => {
  const { transcript } = props;
  const [data, setData] = useState<ProteinSummary | null>(null);

  useEffect(() => {
    fetchProteinSummaryStats(props.transcript.id).then((result) => {
      if (result) {
        setData(result);
      }
    });
  }, [props.transcript.id]);

  return (
    <div className={styles.proteinsListItemInfo}>
      {transcript.cds && (
        <ProteinDomainImage transcriptId={transcript.id} width={695} />
      )}
      {transcript.cds && (
        <div className={styles.bottomWrapper}>
          <div>
            <ExternalLink
              source={ExternalSource.INTERPRO}
              externalId={data?.pdbeId}
            />
            <ExternalLink
              source={ExternalSource.UNIPROT}
              externalId={data?.pdbeId}
            />
            Download component
          </div>
          <div>
            <ExternalLink
              source={ExternalSource.PDBE}
              externalId={data?.pdbeId}
            />
            {data?.proteinStats && (
              <ProteinFeaturesCount proteinStats={data?.proteinStats} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

type ExternalLinkProps = {
  source: ExternalSource;
  externalId: string | undefined;
};

const ExternalLink = (props: ExternalLinkProps) => {
  const externalUrl = `${externalSourceLinks[props.source]}${props.externalId}`;

  return props.externalId ? (
    <span>
      {props.source} (image here) <a href={externalUrl}>{props.externalId}</a>
    </span>
  ) : null;
};

export default ProteinsListItemInfo;
