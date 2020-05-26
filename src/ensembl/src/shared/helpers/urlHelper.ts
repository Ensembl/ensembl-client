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

import queryString from 'query-string';

export const speciesSelector = () => '/app/species-selector';
export const customDownload = () => '/app/custom-download';

type BrowserUrlParams = {
  genomeId?: string | null;
  focus?: string | null;
  location?: string | null;
};

type EntityViewerUrlParams = {
  genomeId?: string | null;
  entityId?: string;
};

export const browser = (params?: BrowserUrlParams) => {
  if (params) {
    const path = `/app/browser/${params.genomeId}`;
    const query = queryString.stringify(
      {
        focus: params.focus,
        location: params.location || undefined // have to use undefined, because if location is null it will still get in query
      },
      {
        encode: false
      }
    );
    return query ? `${path}?${query}` : path;
  } else {
    return `/app/browser/`;
  }
};

export const entityViewer = (params?: EntityViewerUrlParams) => {
  if (!params?.genomeId && params?.entityId) {
    // this should never happen; this combination doesn't make sense
    throw 'Malformed Entity Viewer url';
  }
  const genomeId = params?.genomeId || '';
  const entityId = params?.entityId || '';

  return `/app/entity-viewer/${genomeId}/${entityId}`;
};
