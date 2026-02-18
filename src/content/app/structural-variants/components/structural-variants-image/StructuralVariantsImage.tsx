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
  useState,
  useRef,
  use,
  type DetailedHTMLProps,
  type HTMLAttributes
} from 'react';
import { useNavigate } from 'react-router-dom';
import '@ensembl/ensembl-structural-variants';

import { useAppSelector } from 'src/store';

import config from 'config';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getTrackIds } from 'src/content/app/structural-variants/state/tracks/tracksSelectors';

import { StructuralVariantsImageContext } from 'src/content/app/structural-variants/contexts/StructuralVariantsImageContext';
import { Toolbox, ToolboxPosition } from 'src/shared/components/toolbox';
import TooltipContent from '../structural-variants-feature-tooltip/TooltipContent';
import TooltipBottomContent from '../structural-variants-feature-tooltip/TooltipBottomContent';

import type {
  StructuralVariantsBrowser,
  Endpoints,
  ViewportChangePayload,
  TrackPositionsChangeEvent,
  FeatureClickEventDetails
} from '@ensembl/ensembl-structural-variants';
import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';

import styles from './StructuralVariantsImage.module.css';

type Props = {
  referenceGenomeId: string;
  altGenomeId: string;
  referenceGenomeLocation: GenomicLocation;
  altGenomeLocation: GenomicLocation | null;
  regionLength: number;
  altRegionLength: number;
};

const StructuralVariantsImage = (props: Props) => {
  const { referenceGenomeId, altGenomeId } = props;
  const navigate = useNavigate();
  const [featureMessage, setFeatureMessage] =
    useState<FeatureClickEventDetails | null>(null);
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);
  // NOTE: the line below isn't great; ideally, the tooltip would be able to adjust its position automatically
  const [toolboxPosition, setToolboxPosition] = useState(ToolboxPosition.RIGHT);
  const imageContext = use(StructuralVariantsImageContext);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackIds = useAppSelector((state) => {
    return getTrackIds(state, referenceGenomeId, altGenomeId);
  });

  if (!imageContext) {
    throw new Error(
      'StructuralVariantsImage component should be used inside of StructuralVariantsImageContext'
    );
  }

  const { setTracks } = imageContext;

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

  const onTrackPositionsChange = (event: TrackPositionsChangeEvent) => {
    setTracks(event.detail.tracks);
  };

  const onFeatureMessage = (event: CustomEvent<FeatureClickEventDetails>) => {
    const { width: containerWidth } =
      containerRef.current!.getBoundingClientRect();
    if (event.detail.payload.x > containerWidth / 2) {
      setToolboxPosition(ToolboxPosition.LEFT);
    } else {
      setToolboxPosition(ToolboxPosition.RIGHT);
    }
    setFeatureMessage(event.detail);
  };

  const onPopupAnchorMounted = (element: HTMLSpanElement) => {
    setPopupAnchor(element);

    return () => setPopupAnchor(null);
  };

  const onPopupClose = () => {
    setFeatureMessage(null);
  };

  // Replace the ens-sv-browser component with a new one when reference region name changes
  // (so that ens-sv-browser could find appropriate initial coordinates for alt genome)
  const componentKey = `${props.referenceGenomeId}${props.referenceGenomeLocation.regionName}`;

  if (!trackIds.referenceGenomeTrackIds.length) {
    return null;
  }

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <ens-sv-browser
        onviewport-change-end={onViewportChangeEnd}
        ontrack-positions-change={onTrackPositionsChange}
        onfeature-message={onFeatureMessage}
        key={componentKey}
        referenceGenomeId={props.referenceGenomeId}
        altGenomeId={props.altGenomeId}
        start={props.referenceGenomeLocation.start}
        end={props.referenceGenomeLocation.end}
        altStart={props.altGenomeLocation?.start ?? 0}
        altEnd={props.altGenomeLocation?.end ?? 0}
        regionName={props.referenceGenomeLocation.regionName}
        regionLength={props.regionLength}
        altRegionLength={props.altRegionLength}
        referenceTracks={trackIds.referenceGenomeTrackIds}
        altTracks={trackIds.altGenomeTrackIds}
        endpoints={{
          genomeBrowser: config.genomeBrowserBackendBaseUrl,
          alignments: `${config.structuralVariantsApiBaseUrl}/alignments`,
          variants: `${config.structuralVariantsApiBaseUrl}/variants`
        }}
      />
      {featureMessage && (
        <span
          ref={onPopupAnchorMounted}
          className={styles.tooltipAnchor}
          style={{
            left: `${featureMessage.payload.x}px`,
            top: `${featureMessage.payload.y}px`
          }}
        />
      )}
      {featureMessage && popupAnchor && (
        <Toolbox
          anchor={popupAnchor}
          position={toolboxPosition}
          onOutsideClick={onPopupClose}
        >
          <TooltipContent content={featureMessage.payload.content} />
          <TooltipBottomContent
            genomeId={referenceGenomeId}
            payload={featureMessage.payload}
          />
        </Toolbox>
      )}
    </div>
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
  altRegionLength: number;
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
