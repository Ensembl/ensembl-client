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

import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';

import ViewInAppPopup from 'src/shared/components/view-in-app-popup/ViewInAppPopup';

import {
  geneGenomeBrowserUrl,
  geneFeatureExplorerUrl,
  openInNewTab
} from 'src/content/app/tools/vep/utils/featureExplorerUrls';

import type { Strand } from 'src/shared/types/core-api/strand';

import styles from './VepResultsGene.module.css';
import commonStyles from '../../VepSubmissionResults.module.css';

type Props = {
  genomeId: string;
  stableId: string;
  symbol: string | null;
  strand: 'forward' | 'reverse';
};

const VepResultsGene = (props: Props) => {
  const { genomeId, stableId, symbol, strand } = props;

  // Clicking the gene id opens a small "View in" popup offering the Genome
  // Browser and the Feature Explorer (the entityViewer slot is the Feature
  // Explorer). Both open the full Ensembl app in a new tab.
  const links = {
    genomeBrowser: openInNewTab(geneGenomeBrowserUrl(genomeId, stableId)),
    entityViewer: openInNewTab(geneFeatureExplorerUrl(genomeId, stableId))
  };

  return (
    <>
      <div>
        {symbol && <span className={styles.symbol}>{symbol} </span>}
        <ViewInAppPopup links={links}>{stableId}</ViewInAppPopup>
      </div>
      <div className={commonStyles.smallLight}>
        {getStrandDisplayName(strand as Strand)}
      </div>
    </>
  );
};

export default VepResultsGene;
