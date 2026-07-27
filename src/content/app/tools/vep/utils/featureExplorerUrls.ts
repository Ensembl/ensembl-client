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
 * Full Ensembl URLs for the "View in" popups on VEP results — Genome Browser
 * (location, gene) and Feature Explorer (gene, transcript, protein).
 *
 * The standalone VEP app has no host router to resolve root-relative paths, so
 * the popups link out to the full Ensembl app instead, built here from simple
 * templates. `genomeId` is the genome UUID (the human-readable tag is being
 * retired), as the results view now resolves it.
 */

const ENSEMBL_BASE_URL = 'https://beta.ensembl.org';
const GENOME_BROWSER_PATH = 'genome-browser';
const FEATURE_EXPLORER_PATH = 'feature-explorer';

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
  `${ENSEMBL_BASE_URL}/${GENOME_BROWSER_PATH}/${genomeId}?focus=location:${location.regionName}:${location.start}-${location.end}`;

export const geneGenomeBrowserUrl = (
  genomeId: string,
  geneStableId: string
): string =>
  `${ENSEMBL_BASE_URL}/${GENOME_BROWSER_PATH}/${genomeId}?focus=gene:${stripVersion(geneStableId)}`;

// --- Feature Explorer ------------------------------------------------------

export const geneFeatureExplorerUrl = (
  genomeId: string,
  geneStableId: string
): string =>
  `${ENSEMBL_BASE_URL}/${FEATURE_EXPLORER_PATH}/${genomeId}/gene:${stripVersion(geneStableId)}?view=transcripts`;

export const transcriptFeatureExplorerUrl = (
  genomeId: string,
  transcriptStableId: string
): string =>
  `${ENSEMBL_BASE_URL}/${FEATURE_EXPLORER_PATH}/${genomeId}/transcript:${stripVersion(transcriptStableId)}`;

export const proteinFeatureExplorerUrl = (
  genomeId: string,
  geneStableId: string,
  proteinStableId: string
): string =>
  `${ENSEMBL_BASE_URL}/${FEATURE_EXPLORER_PATH}/${genomeId}/gene:${stripVersion(geneStableId)}?view=protein&protein_id=${stripVersion(proteinStableId)}`;

// --- Opening the link ------------------------------------------------------

// ViewInApp delegates a link click to a function when the link is a function
// (rather than an in-app `navigate`). These destinations are external, so the
// handler opens a new tab.
export const openInNewTab =
  (url: string): (() => void) =>
  () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
