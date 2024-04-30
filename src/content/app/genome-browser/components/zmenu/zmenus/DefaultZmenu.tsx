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

import ZmenuContent from '../ZmenuContent';

import type {
  ZmenuContentDefault,
  ZmenuPayload
} from 'src/content/app/genome-browser/services/genome-browser-service/types/zmenu';

type Props = {
  payload: ZmenuPayload;
  onDestroy: () => void;
};

const DefaultZmenu = (props: Props) => {
  const { content } = props.payload;

  const featureMetadata = extractFeatureMetadata(props.payload);

  const featureId =
    featureMetadata.type && featureMetadata.id
      ? `${featureMetadata.type}:${featureMetadata.id}`
      : undefined;

  return (
    <ZmenuContent
      features={content}
      featureId={featureId}
      destroyZmenu={props.onDestroy}
    />
  );
};

const extractFeatureMetadata = (payload: ZmenuPayload) => {
  const zmenuContent = payload.content[0] as ZmenuContentDefault;
  const featureMetadata = zmenuContent.metadata;

  return {
    id: featureMetadata.id,
    type: featureMetadata.type
  };
};

export default DefaultZmenu;
