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

import '@ensembl/ensembl-structural-variants';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import config from 'config';

import type {
  EnsSvBrowser,
  Endpoints
} from '@ensembl/ensembl-structural-variants';

const CHROMOSOME_LENGTH = 248956422; // length of chromosome 1
const REGION_NAME = '1';
const INITIAL_START = 142_500_000;
const INITIAL_END = 145_500_000;

const chm13T2TGenomeId = '4c07817b-c7c5-463f-8624-982286bc4355';
const grch38GenomeId = 'a7335667-93e7-11ec-a39d-005056b38ce3';

const REFERENCE_TRACKS = ['sv-gene', '950a71e1-5229-459c-822f-d104506d24e8'];
const ALT_TRACKS = ['sv-gene', 'a8691c70-7d68-4322-937d-938affb1b4ea'];

const StructuralVariantsImage = () => {
  return (
    <div>
      <ens-sv-browser
        referenceGenomeId={chm13T2TGenomeId}
        altGenomeId={grch38GenomeId}
        start={INITIAL_START}
        end={INITIAL_END}
        regionName={REGION_NAME}
        regionLength={CHROMOSOME_LENGTH}
        referenceTracks={REFERENCE_TRACKS}
        altTracks={ALT_TRACKS}
        endpoints={{
          genomeBrowser: 'https://dev-2020.ensembl.org/api/browser/data',
          alignments: `${config.structuralVariantsApiBaseUrl}/alignments`,
          variants: `${config.structuralVariantsApiBaseUrl}/variants`
        }}
      />
    </div>
  );
};

type StructuralVariantsBrowserProps = DetailedHTMLProps<
  HTMLAttributes<EnsSvBrowser>,
  EnsSvBrowser
> & {
  referenceGenomeId: string;
  altGenomeId: string;
  start: number;
  end: number;
  regionName: string;
  regionLength: number;
  altStart?: number;
  altEnd?: number;
  referenceTracks: string[];
  altTracks: string[];
  endpoints: Endpoints;
};

declare module 'react/jsx-runtime' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ens-sv-browser': StructuralVariantsBrowserProps;
    }
  }
}

export default StructuralVariantsImage;
