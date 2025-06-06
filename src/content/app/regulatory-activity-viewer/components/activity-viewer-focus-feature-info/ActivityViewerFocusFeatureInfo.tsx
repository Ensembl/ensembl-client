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

import styles from './ActivityViewerFocusFeatureInfo.module.css';

const ActivityViewerFocusFeatureInfo = () => {
  const { assemblyAccessionId, focusGeneId, location } = useActivityViewerIds();

  return assemblyAccessionId && location && focusGeneId ? (
    <ActivityViewerFocusGene
      assemblyId={assemblyAccessionId}
      geneId={focusGeneId}
      regionName={location.regionName}
    />
  ) : null;
};

const ActivityViewerFocusGene = ({
  assemblyId,
  geneId,
  regionName
}: {
  assemblyId: string;
  geneId: string;
  regionName: string;
}) => {
  const { data: gene } = useFocusGeneQuery({
    assemblyId,
    geneId
  });

  if (!gene) {
    return null;
  }

  return (
    <div className={styles.feature}>
      <span className={styles.labelledElement}>
        <span className={styles.smallLight}>Gene</span>
        <GeneName symbol={gene.symbol} stable_id={gene.stable_id} />
      </span>
      <GeneBiotype biotype={gene.biotype} />
      <span>{getStrandDisplayName(gene.strand)}</span>
      <FullLocation regionName={regionName} start={gene.start} end={gene.end} />
    </div>
  );
};

const GeneBiotype = ({ biotype }: { biotype: string }) => {
  return (
    <span className={styles.labelledElement}>
      <span className={styles.smallLight}>Biotype</span>
      <span>{biotype}</span>
    </span>
  );
};

const FullLocation = ({
  regionName,
  start,
  end
}: {
  regionName: string;
  start: number;
  end: number;
}) => {
  const formattedLocationString = getFormattedLocation({
    chromosome: regionName,
    start,
    end
  });

  return (
    <span className={styles.fullLocation}>
      <span>{formattedLocationString}</span>
    </span>
  );
};

export default ActivityViewerFocusFeatureInfo;
