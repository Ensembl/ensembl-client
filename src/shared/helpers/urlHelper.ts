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

export const home = () => '/';
export const speciesSelector = () => '/species-selector';

type BrowserUrlParams = {
  genomeId?: string | null;
  focus?: string | null;
  location?: string | null;
};

type EntityViewerUrlParams = {
  genomeId?: string | null;
  entityId?: string | null;
  view?: string | null;
  proteinId?: string | null;
};

type SpeciesPageUrlParams = {
  genomeId: string;
};

export const speciesPage = (params: SpeciesPageUrlParams) => {
  const speciesPageRootPath = '/species';

  return `${speciesPageRootPath}/${params.genomeId}`;
};

export const browser = (params?: BrowserUrlParams) => {
  const browserRootPath = '/genome-browser';
  if (params) {
    const path = `${browserRootPath}/${params.genomeId}`;
    const urlSearchParams = new URLSearchParams('');
    if (params.focus) {
      urlSearchParams.append('focus', params.focus);
    }
    if (params.location) {
      urlSearchParams.append('location', params.location);
    }
    const query = decodeURIComponent(urlSearchParams.toString());
    return query ? `${path}?${query}` : path;
  } else {
    return browserRootPath;
  }
};

export const entityViewer = (params?: EntityViewerUrlParams) => {
  if (!params?.genomeId && params?.entityId) {
    // this should never happen; this combination doesn't make sense
    throw 'Malformed Entity Viewer url';
  }

  const genomeId = params?.genomeId || '';
  const entityId = params?.entityId || '';
  let path = '/entity-viewer';
  if (genomeId) {
    path += `/${genomeId}`;
  }
  if (entityId) {
    path += `/${entityId}`;
  }
  const urlSearchParams = new URLSearchParams('');
  if (params?.view) {
    urlSearchParams.append('view', params.view);
  }
  if (params?.proteinId) {
    urlSearchParams.append('protein_id', params.proteinId);
  }
  const query = decodeURIComponent(urlSearchParams.toString());

  return query ? `${path}?${query}` : path;
};

export const entityViewerVariant = (params?: {
  genomeId?: string | null;
  variantId?: string | null;
  alleleId?: string | null;
}) => {
  if (!params?.genomeId && params?.variantId) {
    // this should never happen
    throw 'Invalid parameters combination for Entity Viewer variant url';
  }
  const genomeId = params?.genomeId || '';
  const variantId = params?.variantId || '';
  let path = '/entity-viewer';
  if (genomeId) {
    path += `/${genomeId}`;
  }
  if (variantId) {
    path += `/variant:${variantId}`;
  }
  const urlSearchParams = new URLSearchParams('');
  if (params?.alleleId) {
    urlSearchParams.append('allele', params.alleleId);
  }

  const query = urlSearchParams.toString();

  return query ? `${path}?${query}` : path;
};

export const blastForm = () => '/blast';

export const blastUnviewedSubmissions = () => '/blast/unviewed-submissions';

export const blastSubmissionsList = () => '/blast/submissions';

export const blastSubmission = (submissionId: string) =>
  `/blast/submissions/${submissionId}`;

type RefgetUrlParams = {
  checksum: string;
  start?: number;
  end?: number;
};

/**
 * Refget is using a zero-based coordinate space,
 * with start coordinate inclusive and end exclusive.
 * To translate from Ensembl coordinate space to Refget's,
 * we subtract 1 from the start coordinate
 * and leave the end coordinate as is.
 */
export const refget = (params: RefgetUrlParams) => {
  const { checksum, start, end } = params;
  const searchParams = new URLSearchParams();
  if (typeof start === 'number') {
    const refgetStart = start - 1;
    searchParams.append('start', `${refgetStart}`);
  }
  if (typeof end === 'number') {
    searchParams.append('end', `${end}`);
  }
  searchParams.append('accept', 'text/plain');

  return `${
    config.refgetBaseUrl
  }/sequence/${checksum}?${searchParams.toString()}`;
};
