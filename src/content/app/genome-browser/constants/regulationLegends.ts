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

const regulationLegends = [
  {
    id: 1,
    label: 'Promoter',
    definition:
      'Promoters and enhancers in human and mouse are identified by their epigenomic activity across different cell types. The Ensembl Regulatory build is more likely to classify a regulatory feature as a promoter if it is near the 5’ end of an annotated transcript'
  },
  {
    id: 2,
    label: 'Enhancer',
    definition:
      'Promoters and enhancers in human and mouse are identified by their epigenomic activity across different cell types. Enhancers tend to be further from known transcripts than promoters'
  },
  {
    id: 3,
    label: 'Open chromatin',
    definition:
      'Open chromatin regions in human and mouse are identified as having epigenomic activity, but without the marks typically associated with enhancers or promoters'
  },
  {
    id: 4,
    label: 'CTCF',
    definition:
      'CTCF-binding regions are identified after segmenting the genome according to epigenomic activity. Specifically, they correspond to segmentation states where there is a high degree of CTCF binding'
  },
  {
    id: 5,
    label: 'TF binding',
    definition:
      'These sites are enriched for Transcription Factor binding, but they lack epigenomic evidence to be classified as an enhancer or promoter'
  }
];

export default regulationLegends;
