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

import React from 'react';

import ZmenuContent from '../ZmenuContent';

import {
  type ZmenuCreatePayload,
  type ZmenuContentVariantMetadata
} from '@ensembl/ensembl-genome-browser';

type Props = {
  payload: ZmenuCreatePayload;
  onDestroy: () => void;
};

const VariantZmenu = (props: Props) => {
  const { content } = props.payload;

  const variantMetadata = content[0]?.metadata as
    | ZmenuContentVariantMetadata
    | undefined;
  const variantId = variantMetadata?.id ?? '';

  return (
    <ZmenuContent
      features={content}
      featureId={`variant:${variantId}`}
      destroyZmenu={props.onDestroy}
    />
  );
};

export default VariantZmenu;
