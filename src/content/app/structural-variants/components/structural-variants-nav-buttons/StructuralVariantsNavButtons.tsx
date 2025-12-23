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

import { useRef, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';
import '@ensembl/ensembl-structural-variants/nav-buttons';

import * as urlFor from 'src/shared/helpers/urlHelper';

import type { ViewportChangePayload } from '@ensembl/ensembl-structural-variants';
import type { NavButtonsForStructuralVariantsBrowser } from '@ensembl/ensembl-structural-variants/nav-buttons';
import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';

type NavButtonsProperties = {
  start: number;
  end: number;
  altStart: number;
  altEnd: number;
  regionLength: number;
};

type Props = {
  referenceGenomeId: string;
  altGenomeId: string;
  referenceGenomeLocation: GenomicLocation;
  altGenomeLocation: GenomicLocation | null;
};

const StructuralVariantsNavButtons = (props: Props) => {
  const navigate = useNavigate();

  const onViewportChange = (event: CustomEvent<ViewportChangePayload>) => {
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
  const onViewportChangeRef = useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;

  const onMount = (element: NavButtonsForStructuralVariantsBrowser) => {
    const viewportChangeHandler = (event: Event) => {
      onViewportChangeRef.current(event as CustomEvent<ViewportChangePayload>);
    };
    element.addEventListener('viewport-change', viewportChangeHandler);

    return () => {
      element.removeEventListener('viewport-change', viewportChangeHandler);
    };
  };

  return (
    <ens-sv-nav-buttons
      ref={onMount}
      start={props.referenceGenomeLocation.start}
      end={props.referenceGenomeLocation.end}
      altStart={props.altGenomeLocation?.start ?? 1}
      altEnd={props.altGenomeLocation?.end ?? Infinity}
      regionLength={Infinity}
    />
  );
};

export default StructuralVariantsNavButtons;

type StructuralVariantsNavButtonsProps = DetailedHTMLProps<
  HTMLAttributes<NavButtonsForStructuralVariantsBrowser>,
  NavButtonsForStructuralVariantsBrowser
> &
  NavButtonsProperties;

declare module 'react/jsx-runtime' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ens-sv-nav-buttons': StructuralVariantsNavButtonsProps;
    }
  }
}
