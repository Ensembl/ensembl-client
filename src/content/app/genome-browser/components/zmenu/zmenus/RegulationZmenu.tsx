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

import { useAppSelector } from 'src/store';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import ZmenuContent from '../ZmenuContent';
import {
  ToolboxExpandableContent,
  ToggleButton
} from 'src/shared/components/toolbox';
import InstantDownloadRegFeature from 'src/shared/components/instant-download/instant-download-regulation/InstantDownloadRegFeature';

import type {
  ZmenuPayload,
  ZmenuContentRegulation
} from 'src/content/app/genome-browser/services/genome-browser-service/types/zmenu';

type Props = {
  payload: ZmenuPayload;
  onDestroy: () => void;
};

const RegulationZmenu = (props: Props) => {
  const { content } = props.payload;
  const genomeId = useAppSelector(getBrowserActiveGenomeId) || '';

  const featureMetadata = extractFeatureMetadata(props.payload);

  const mainContent = (
    <div>
      <ZmenuContent
        features={content}
        featureId={`regulation:${featureMetadata.id}`} /* we can't navigate to regulatory feature anyway */
        destroyZmenu={props.onDestroy}
      />
      <ToggleButton label="Download" />
    </div>
  );

  const footerContent = genomeId ? (
    <InstantDownloadRegFeature genomeId={genomeId} {...featureMetadata} />
  ) : null;

  return (
    <ToolboxExpandableContent
      mainContent={mainContent}
      footerContent={footerContent}
    />
  );
};

const extractFeatureMetadata = (payload: ZmenuPayload) => {
  const zmenuContent = payload.content[0] as ZmenuContentRegulation;
  const featureMetadata = zmenuContent.metadata;

  return {
    id: featureMetadata.id,
    regionName: featureMetadata.region_name,
    featureType: featureMetadata.feature_type,
    start: featureMetadata.start,
    end: featureMetadata.end,
    coreStart: featureMetadata.core_start,
    coreEnd: featureMetadata.core_end
  };
};

export default RegulationZmenu;
