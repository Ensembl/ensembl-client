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

import '@ensembl/ensembl-structural-variants/alignments';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import config from 'config';

import type { VariantAlignments } from '@ensembl/ensembl-structural-variants/alignments';

const CHROMOSOME_LENGTH = 248956422; // length of chromosome 1
const REGION_NAME = '1';
const INITIAL_START = 142_500_000;
const INITIAL_END = 145_500_000;

const chm13T2TGenomeId = '4c07817b-c7c5-463f-8624-982286bc4355';
const grch38GenomeId = 'a7335667-93e7-11ec-a39d-005056b38ce3';

const StructuralVariantsImage = () => {
  return (
    <div>
      <ens-sv-alignments
        referenceGenomeId={chm13T2TGenomeId}
        altGenomeId={grch38GenomeId}
        start={INITIAL_START}
        end={INITIAL_END}
        regionName={REGION_NAME}
        regionLength={CHROMOSOME_LENGTH}
        endpoints={{
          alignments: `${config.structuralVariantsApiBaseUrl}/alignments`,
          variants: `${config.structuralVariantsApiBaseUrl}/variants`
        }}
      />
    </div>
  );
};

type EnsSVAlignmentsProps = DetailedHTMLProps<
  HTMLAttributes<VariantAlignments>,
  VariantAlignments
> & {
  referenceGenomeId: string;
  altGenomeId: string;
  start: number;
  end: number;
  regionName: string;
  regionLength: number;
  endpoints: {
    alignments: string;
    variants: string;
  };
};

declare module 'react/jsx-runtime' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ens-sv-alignments': EnsSVAlignmentsProps;
    }
  }
}

export default StructuralVariantsImage;
