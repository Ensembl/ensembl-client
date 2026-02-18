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

// NOTE: Using types imported from the structural variants package couples this component
// to structural variants
import type { FeatureClickEventDetails } from '@ensembl/ensembl-structural-variants';

import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  buildFocusIdForUrl,
  buildFocusVariantId
} from 'src/shared/helpers/focusObjectHelpers';

import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import {
  ZmenuPayloadVarietyType,
  type ZmenuContentGeneMetadata,
  type ZmenuContentVariantMetadata
} from 'src/content/app/genome-browser/services/genome-browser-service/types/zmenu';

import styles from './TooltipContent.module.css';

// Minimal set of genome information sufficient to generate links to internal pages,
// or, externally, to the regulation subsite
type MinimalGenomeInfo = {
  genome_id: string;
  genome_tag: string | null;
  scientific_name: string; // <-- for links to regulation subsite
  release: { name: string }; // <-- for links to regulation subsite
};

type Props = {
  genome: MinimalGenomeInfo;
  payload: FeatureClickEventDetails['payload'];
};

const TooltipBottomContent = (props: Props) => {
  const payloadVariety = props.payload.variety.find(
    (variety) => !!variety['zmenu-type']
  )?.['zmenu-type'];

  if (payloadVariety === ZmenuPayloadVarietyType.GENE_AND_ONE_TRANSCRIPT) {
    const geneData = props.payload.content.find((feature) => {
      const metadata = feature.metadata as Record<string, string>;
      return metadata.type === 'gene';
    });

    if (geneData) {
      return (
        <BottomContentGene
          genome={props.genome}
          payload={geneData.metadata as ZmenuContentGeneMetadata}
        />
      );
    }
  } else if (payloadVariety === ZmenuPayloadVarietyType.VARIANT) {
    const variantData = props.payload.content[0];

    if (variantData) {
      return (
        <BottomContentVariant
          genome={props.genome}
          payload={variantData.metadata as ZmenuContentVariantMetadata}
        />
      );
    }
  }
};

// NOTE: consider genome tag when using genome id for url

const BottomContentGene = ({
  genome,
  payload
}: {
  genome: MinimalGenomeInfo;
  payload: ZmenuContentGeneMetadata;
}) => {
  const geneFocusId = buildFocusIdForUrl({
    type: 'gene',
    objectId: payload.unversioned_id
  });
  const genomeIdForUrl = getGenomeIdForUrl(genome);

  const links = {
    genomeBrowser: {
      url: urlFor.browser({
        genomeId: genomeIdForUrl,
        focus: geneFocusId
      })
    },
    entityViewer: {
      url: urlFor.entityViewer({
        genomeId: genomeIdForUrl,
        entityId: geneFocusId
      })
    }
  };

  return (
    <div className={styles.appLinks}>
      <ViewInApp theme="dark" links={links} />
    </div>
  );
};

const BottomContentVariant = ({
  genome,
  payload
}: {
  genome: MinimalGenomeInfo;
  payload: ZmenuContentVariantMetadata;
}) => {
  const variantId = buildFocusVariantId({
    regionName: payload.region_name,
    start: payload.start,
    variantName: payload.id
  });
  const genomeIdForUrl = getGenomeIdForUrl(genome);

  const links = {
    genomeBrowser: {
      url: urlFor.browser({
        genomeId: genomeIdForUrl,
        focus: variantId
      })
    },
    entityViewer: {
      url: urlFor.entityViewer({
        genomeId: genomeIdForUrl,
        entityId: variantId
      })
    }
  };

  return (
    <div className={styles.appLinks}>
      <ViewInApp className={styles.viewIn} theme="dark" links={links} />
    </div>
  );
};

const getGenomeIdForUrl = (genome: MinimalGenomeInfo) => {
  return genome.genome_tag ?? genome.genome_id;
};

export default TooltipBottomContent;
