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

import config from 'config';

type CommonOverlapRequestFields = {
  genome_uuid: string;
  location: {
    start: number;
    end: number;
  };
};

type FocusLocationFields = {
  focus_location: {
    region_name: string;
    start: number;
    end: number;
  };
};

type FocusGeneFields = {
  focus_gene: { stable_id: string };
};

type FocusTranscriptFields = {
  focus_transcript: { stable_id: string };
  sequence_type: string;
};

type FocusFeatureFields =
  FocusLocationFields | FocusGeneFields | FocusTranscriptFields;

export type OverlapRequestParamsWithoutLocation = Omit<
  CommonOverlapRequestFields,
  'location'
> &
  FocusFeatureFields;

export type OverlapRequestParams = CommonOverlapRequestFields &
  FocusFeatureFields;

// Not using RTK-query, because the request will be sent from a web component outside of the react tree
export const fetchOverlapTemplate = async (params: OverlapRequestParams) => {
  const url = `${config.annotatedSequenceApi}/overlaps`;
  const request = new Request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  const response = await fetch(request);
  return response.text();
};
