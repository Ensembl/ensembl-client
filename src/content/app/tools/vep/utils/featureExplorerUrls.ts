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

/**
 * URLs for the "View in" popups on VEP results — Genome Browser (location,
 * gene) and Feature Explorer (gene, transcript, protein).
 *
 * These are root-relative urls built through urlHelper, so ViewInApp navigates
 * to them within the app and they follow whatever paths urlHelper defines. The
 * standalone VEP repo built absolute https://beta.ensembl.org urls here and
 * opened them in a new tab, because it had no host router to resolve
 * root-relative paths; inside ensembl-client that is both unnecessary and wrong
 * (it would send a user on a dev or staging deployment to production).
 *
 * `genomeId` is the genome UUID (the human-readable tag is being retired), as
 * the results view now resolves it.
 */

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

// Ensembl stable ids carry a `.<version>` suffix (e.g. ENSG00000012048.23). The
// "View in" popups link to the unversioned id — the Ensembl app resolves it to
// the current version — so strip the suffix before building the URL.
const stripVersion = (stableId: string): string =>
  stableId.replace(/\.\d+$/, '');

// --- Genome Browser --------------------------------------------------------

export const locationGenomeBrowserUrl = (
  genomeId: string,
  location: { regionName: string; start: number; end: number }
): string =>
  urlFor.browser({
    genomeId,
    focus: buildFocusIdForUrl({
      type: 'location',
      objectId: `${location.regionName}:${location.start}-${location.end}`
    })
  });

export const geneGenomeBrowserUrl = (
  genomeId: string,
  geneStableId: string
): string =>
  urlFor.browser({
    genomeId,
    focus: buildFocusIdForUrl({
      type: 'gene',
      objectId: stripVersion(geneStableId)
    })
  });

// --- Feature Explorer ------------------------------------------------------

export const geneFeatureExplorerUrl = (
  genomeId: string,
  geneStableId: string
): string =>
  urlFor.entityViewer({
    genomeId,
    entityId: buildFocusIdForUrl({
      type: 'gene',
      objectId: stripVersion(geneStableId)
    }),
    view: 'transcripts'
  });

export const transcriptFeatureExplorerUrl = (
  genomeId: string,
  transcriptStableId: string
): string =>
  urlFor.entityViewer({
    genomeId,
    entityId: buildFocusIdForUrl({
      type: 'transcript',
      objectId: stripVersion(transcriptStableId)
    })
  });

export const proteinFeatureExplorerUrl = (
  genomeId: string,
  geneStableId: string,
  proteinStableId: string
): string =>
  urlFor.entityViewer({
    genomeId,
    entityId: buildFocusIdForUrl({
      type: 'gene',
      objectId: stripVersion(geneStableId)
    }),
    view: 'protein',
    proteinId: stripVersion(proteinStableId)
  });
