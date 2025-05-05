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

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import { useFocusGeneQuery } from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

import GeneName from 'src/shared/components/gene-name/GeneName';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import styles from './ActivityViewerFocusFeatureInfo.module.css';

const ActivityViewerFocusFeatureInfo = () => {
  const { assemblyName, focusGeneId, location } = useActivityViewerIds();

  return (
    <div className={styles.container}>
      {assemblyName && location && focusGeneId && (
        <ActivityViewerFocusGene
          assemblyName={assemblyName}
          geneId={focusGeneId}
          regionName={location.regionName}
        />
      )}
    </div>
  );
};

const ActivityViewerFocusGene = ({
  assemblyName,
  geneId,
  regionName
}: {
  assemblyName: string;
  geneId: string;
  regionName: string;
}) => {
  const { data: gene } = useFocusGeneQuery({
    assemblyName,
    geneId
  });

  if (!gene) {
    return null;
  }

  return (
    <div className={styles.grid}>
      <div className={styles.leftColumn}>Gene</div>
      <div className={styles.mainColumn}>
        <GeneName symbol={gene.symbol} stable_id={gene.stable_id} />
        <GeneBiotype biotype={gene.biotype} />
        <FullLocation
          regionName={regionName}
          start={gene.start}
          end={gene.end}
          strand={gene.strand}
        />
        {gene.name && (
          <GeneFullName
            name={gene.name.value}
            accessionId={gene.name.accession_id}
            url={gene.name.url}
          />
        )}
      </div>
    </div>
  );
};

const GeneBiotype = ({ biotype }: { biotype: string }) => {
  return (
    <span className={styles.geneBiotype}>
      <span className={styles.smallLight}>Biotype</span>
      <span>{biotype}</span>
    </span>
  );
};

const GeneFullName = ({
  name,
  accessionId,
  url
}: {
  name: string;
  accessionId?: string;
  url?: string;
}) => {
  return (
    <span className={styles.geneFullName}>
      <span>{name}</span>
      {accessionId && url && (
        <ExternalLink to={url}>{accessionId}</ExternalLink>
      )}
    </span>
  );
};

const FullLocation = ({
  regionName,
  start,
  end,
  strand
}: {
  regionName: string;
  start: number;
  end: number;
  strand: 'forward' | 'reverse';
}) => {
  const formattedLocationString = getFormattedLocation({
    chromosome: regionName,
    start,
    end
  });

  return (
    <span className={styles.fullLocation}>
      <span>{formattedLocationString}</span>
      <span className={styles.smallLight}>{getStrandDisplayName(strand)}</span>
    </span>
  );
};

export default ActivityViewerFocusFeatureInfo;
