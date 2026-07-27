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

import {
  locationGenomeBrowserUrl,
  geneGenomeBrowserUrl,
  geneFeatureExplorerUrl,
  transcriptFeatureExplorerUrl,
  proteinFeatureExplorerUrl
} from './featureExplorerUrls';

describe('genome browser urls', () => {
  it('builds a location focus url', () => {
    expect(
      locationGenomeBrowserUrl('grch38', {
        regionName: '19',
        start: 100,
        end: 150
      })
    ).toBe('/genome-browser/grch38?focus=location:19:100-150');
  });

  it('builds a gene focus url, stripping the version', () => {
    expect(geneGenomeBrowserUrl('grch38', 'ENSG00000012048.23')).toBe(
      '/genome-browser/grch38?focus=gene:ENSG00000012048'
    );
  });
});

describe('feature explorer urls', () => {
  it('builds a gene url, stripping the version', () => {
    expect(geneFeatureExplorerUrl('grch38', 'ENSG00000012048.23')).toBe(
      '/feature-explorer/grch38/gene:ENSG00000012048?view=transcripts'
    );
  });

  it('builds a transcript url, stripping the version', () => {
    expect(transcriptFeatureExplorerUrl('grch38', 'ENST00000315985.7')).toBe(
      '/feature-explorer/grch38/transcript:ENST00000315985'
    );
  });

  it('builds a protein url, stripping the gene and protein versions', () => {
    expect(
      proteinFeatureExplorerUrl(
        'grch38',
        'ENSG00000012048.23',
        'ENSP00000369497.3'
      )
    ).toBe(
      '/feature-explorer/grch38/gene:ENSG00000012048?view=protein&protein_id=ENSP00000369497'
    );
  });

  it('uses the genome id verbatim, so a UUID works when there is no tag', () => {
    expect(geneFeatureExplorerUrl('a7335667-93e7-11ec-a8a3', 'ENSG1')).toBe(
      '/feature-explorer/a7335667-93e7-11ec-a8a3/gene:ENSG1?view=transcripts'
    );
  });
});
