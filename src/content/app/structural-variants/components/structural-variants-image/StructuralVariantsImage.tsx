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

import { useNavigate } from 'react-router-dom';
import '@ensembl/ensembl-structural-variants';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import config from 'config';

import * as urlFor from 'src/shared/helpers/urlHelper';

import type {
  StructuralVariantsBrowser,
  Endpoints,
  ViewportChangePayload
} from '@ensembl/ensembl-structural-variants';
import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';

const CHROMOSOME_LENGTH = 248956422; // length of chromosome 1

const REFERENCE_TRACKS = ['sv-gene', '950a71e1-5229-459c-822f-d104506d24e8'];
const ALT_TRACKS = ['sv-gene', 'a8691c70-7d68-4322-937d-938affb1b4ea'];

type Props = {
  referenceGenomeId: string;
  altGenomeId: string;
  referenceGenomeLocation: GenomicLocation;
  altGenomeLocation: GenomicLocation | null;
};

const StructuralVariantsImage = (props: Props) => {
  const navigate = useNavigate();

  const onViewportChangeEnd = (event: CustomEvent<ViewportChangePayload>) => {
    const referenceGenomeLocation = event.detail.reference;
    const altGenomeLocation = event.detail.alt;
    const regionName = props.referenceGenomeLocation.regionName;

    const url = urlFor.structuralVariantsViewer({
      referenceGenomeId: props.referenceGenomeId,
      altGenomeId: props.altGenomeId,
      referenceGenomeLocation: {
        regionName,
        ...referenceGenomeLocation
      },
      altGenomeLocation: {
        regionName,
        ...altGenomeLocation
      }
    });

    navigate(url, { replace: true });
  };

  // Replace the ens-sv-browser component with a new one when reference region name changes
  // (so that ens-sv-browser could find appropriate initial coordinates for alt genome)
  const componentKey = `${props.referenceGenomeId}${props.referenceGenomeLocation.regionName}`;

  return (
    <ens-sv-browser
      onviewport-change-end={onViewportChangeEnd}
      key={componentKey}
      referenceGenomeId={props.referenceGenomeId}
      altGenomeId={props.altGenomeId}
      start={props.referenceGenomeLocation.start}
      end={props.referenceGenomeLocation.end}
      altStart={props.altGenomeLocation?.start ?? 0}
      altEnd={props.altGenomeLocation?.end ?? 0}
      regionName={props.referenceGenomeLocation.regionName}
      regionLength={CHROMOSOME_LENGTH}
      referenceTracks={REFERENCE_TRACKS}
      altTracks={ALT_TRACKS}
      endpoints={{
        genomeBrowser: 'https://dev-2020.ensembl.org/api/browser/data',
        alignments: `${config.structuralVariantsApiBaseUrl}/alignments`,
        variants: `${config.structuralVariantsApiBaseUrl}/variants`
      }}
    />
  );
};

type StructuralVariantsBrowserProps = DetailedHTMLProps<
  HTMLAttributes<StructuralVariantsBrowser>,
  StructuralVariantsBrowser
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
