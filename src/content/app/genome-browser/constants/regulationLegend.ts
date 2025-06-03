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

const regulationLegend = [
  {
    colour_code: 1,
    id: 'promoters',
    label: 'Promoter',
    definition:
      'A promoter is a region of DNA that includes transcription factor binding sites and acts as the landing site for the core transcriptional machinery from where transcription initiates.'
  },
  {
    colour_code: 2,
    id: 'enhancers',
    label: 'Enhancer',
    definition:
      'An enhancer is a region of DNA that contains binding sites for transcription factors, which together act to regulate transcriptional initiation, often in a cell type-specific manner.'
  },
  {
    colour_code: 3,
    id: 'open_chromatin_count',
    label: 'Open chromatin',
    definition:
      'A region of DNA that is accessible to transcription factor binding. In our annotation, this refers to a region that has been reliably detected as open in some experimental contexts. It is thus likely to be important for regulation, but we lack evidence to classify it as a promoter or enhancer. Promoters and enhancers in our annotation are a special type of open chromatin region.'
  },
  {
    colour_code: 4,
    id: 'ctcf_count',
    label: 'CTCF binding site',
    definition:
      'CCCTC-binding factor (CTCF) is a highly conserved transcription factor that plays many roles in regulating transcription, including acting as an insulator that blocks interactions between certain enhancers and promoters.'
  }
] as const;

export default regulationLegend;
