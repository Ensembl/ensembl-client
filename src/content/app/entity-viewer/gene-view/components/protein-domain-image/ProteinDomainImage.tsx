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

import { useState, useRef, type TouchEvent, type MouseEvent } from 'react';

import classNames from 'classnames';
import { scaleLinear, ScaleLinear } from 'd3';

import { Toolbox, ToolboxPosition } from 'src/shared/components/toolbox';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import type { FamilyMatchInProduct } from 'src/content/app/entity-viewer/state/api/queries/proteinDomainsQuery';

import styles from './ProteinDomainImage.module.css';

const BLOCK_HEIGHT = 18;
const TRACK_HEIGHT = 24;

export type ProteinDomainImageProps = {
  proteinDomains: FamilyMatchInProduct[];
  trackLength: number;
  width: number; // available width for drawing, in pixels
  classNames?: {
    // FIXME: is this needed?
    track?: string;
    domain?: string;
  };
};

type ProteinDomainLocation = {
  start: number;
  end: number;
};

type ProteinDomainImageData = {
  [resource_name: string]: {
    [domain_name: string]: {
      name: string;
      description: string | null;
      descriptionFromClosestDataProvider: string | null;
      url: string | null;
      urlForClosestDataProvider: string | null;
      resourceName: string;
      accessionIdInClosestDataProvider: string | null;
      closestDataProviderName: string | null;
      locations: ProteinDomainLocation[];
    };
  };
};

export type SingleProteinDomainData = Omit<
  ProteinDomainImageData[string][string],
  'locations'
> & {
  start: number;
  end: number;
};

export const getDomainsByResourceGroups = (
  proteinDomains: FamilyMatchInProduct[]
) => {
  const groupedDomains: ProteinDomainImageData = {};

  proteinDomains.forEach((domain) => {
    const {
      sequence_family: {
        name: domainName,
        description,
        url,
        source: { name: resource_name }
      },
      relative_location: { start, end },
      via: closestDataProvider
    } = domain;
    const {
      description: descriptionFromClosestDataProvider = null,
      url: urlForClosestDataProvider = null
    } = closestDataProvider ?? {};

    if (!groupedDomains[resource_name]) {
      groupedDomains[resource_name] = {};
    }
    if (!groupedDomains[resource_name][domainName]) {
      groupedDomains[resource_name][domainName] = {
        name: domainName,
        description,
        url,
        descriptionFromClosestDataProvider,
        urlForClosestDataProvider,
        resourceName: resource_name,
        accessionIdInClosestDataProvider:
          closestDataProvider?.accession_id ?? null,
        closestDataProviderName: closestDataProvider?.source.name ?? null,
        locations: []
      };
    }

    groupedDomains[resource_name][domainName].locations.push({
      start,
      end
    });
  });

  return groupedDomains;
};

const ProteinDomainImage = (props: ProteinDomainImageProps) => {
  const { proteinDomains, trackLength } = props;
  const proteinDomainsResources = getDomainsByResourceGroups(proteinDomains);

  // Create a scale where the domain is the total length of the track in amino acids.
  // The track is as wide as the longest protein generated from the gene.
  // Therefore, it is guaranteed that the length of the protein drawn by this component will fall within this domain.
  const scale = scaleLinear()
    .domain([0, trackLength])
    .rangeRound([0, props.width])
    .clamp(true);

  return (
    <div className={styles.container}>
      {getSortedProteinDomainsGroups(proteinDomainsResources).map(
        ([resource, domainsGroup]) => (
          <div key={resource} className={styles.resourceGroup}>
            <div className={styles.resourceName}>{resource}</div>
            <div className={styles.resourceImages}>
              {domainsGroup.map((trackData, index) => (
                <TrackWithDomains
                  key={index}
                  trackWidth={props.width}
                  scale={scale}
                  trackData={trackData}
                />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

const TrackWithDomains = (props: {
  trackWidth: number;
  scale: ScaleLinear<number, number>;
  trackData: TrackData;
}) => {
  const { trackWidth, scale, trackData } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [proteinDomainTooltipData, setProteinDomainTooltipData] = useState<{
    domainInfo: SingleProteinDomainData;
    x: number;
    y: number;
  } | null>(null);

  const onProteinDomainClick = (
    domainInfo: SingleProteinDomainData,
    clickCoords: { x: number; y: number }
  ) => {
    const containerRect =
      containerRef.current?.getBoundingClientRect() as DOMRect;
    const { x } = containerRect;
    const tooltipData = {
      domainInfo,
      x: clickCoords.x - x,
      y: 12 // making the tooltip point at the middle of a protein domain rectangle; strangely, it looks better when it's a bit over BLOCK_HEIGHT / 2
    };
    setProteinDomainTooltipData(tooltipData);
  };

  const onProteinDomainTooltipHide = () => {
    setProteinDomainTooltipData(null);
  };

  return (
    <div ref={containerRef} className={styles.resourceImage}>
      <svg
        className={styles.containerSvg}
        width={trackWidth}
        height={BLOCK_HEIGHT}
      >
        <g>
          <Track width={trackWidth} />
          {trackData.locations.map((domain, index) => (
            <DomainBlock
              key={index}
              domain={domain}
              trackData={trackData}
              onClick={onProteinDomainClick}
              scale={scale}
            />
          ))}
        </g>
      </svg>

      {proteinDomainTooltipData && (
        <ProteinDomainInfoTooltip
          {...proteinDomainTooltipData}
          onHide={onProteinDomainTooltipHide}
        />
      )}

      <div className={styles.resourceDescription}>
        {getProteinDomainsTrackDescription(trackData)}
      </div>
    </div>
  );
};

type TrackProps = Pick<ProteinDomainImageProps, 'classNames' | 'width'>;

const Track = (props: TrackProps) => {
  const trackClasses = classNames(styles.track, props.classNames?.track);
  return (
    <g className={trackClasses}>
      <rect height={TRACK_HEIGHT} width={props.width} />
    </g>
  );
};

type DomainBlockProps = {
  domain: {
    start: number;
    end: number;
  };
  trackData: TrackData;
  onClick: (
    domainData: SingleProteinDomainData,
    clickCoords: { x: number; y: number }
  ) => void;
  className?: string;
  scale: ScaleLinear<number, number>;
};

const DomainBlock = (props: DomainBlockProps) => {
  const y = 3;
  const domainClasses = classNames(styles.domain, props.className);

  const onClick = (event: TouchEvent | MouseEvent) => {
    let clientX = 0;
    let clientY = 0;
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const payload = {
      ...props.trackData,
      start: props.domain.start,
      end: props.domain.end
    };

    props.onClick(payload, { x: clientX, y: clientY });
  };

  return (
    <>
      <rect
        key={props.domain.start}
        className={domainClasses}
        y={y}
        height={BLOCK_HEIGHT}
        x={props.scale(props.domain.start)}
        width={props.scale(props.domain.end - props.domain.start + 1)}
        onClick={onClick}
      />
    </>
  );
};

const ProteinDomainInfoTooltip = (props: {
  domainInfo: SingleProteinDomainData;
  x: number;
  y: number;
  onHide: () => void;
}) => {
  const { domainInfo, x, y, onHide } = props;
  const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(
    null
  );

  const anchorStyle = {
    top: `${y}px`,
    left: `${x}px`
  };

  return (
    <>
      <div
        ref={setAnchorElement}
        className={styles.tooltipAnchor}
        style={anchorStyle}
      />
      {anchorElement && (
        <Toolbox
          anchor={anchorElement}
          position={ToolboxPosition.RIGHT}
          onOutsideClick={onHide}
        >
          {domainInfo.url && domainInfo.resourceName && (
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipFieldLabel}>
                {domainInfo.resourceName}
              </span>
              <ExternalLink to={domainInfo.url}>{domainInfo.name}</ExternalLink>
            </div>
          )}
          {domainInfo.closestDataProviderName &&
            domainInfo.urlForClosestDataProvider &&
            domainInfo.accessionIdInClosestDataProvider && (
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipFieldLabel}>
                  {domainInfo.closestDataProviderName}
                </span>
                <ExternalLink to={domainInfo.urlForClosestDataProvider}>
                  {domainInfo.accessionIdInClosestDataProvider}
                </ExternalLink>
              </div>
            )}
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipFieldLabel}>Description</span>
            <span>{getProteinDomainsTrackDescription(domainInfo)}</span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipFieldLabel}>Position</span>
            <span>
              {domainInfo.start}-{domainInfo.end} aa
            </span>
          </div>
        </Toolbox>
      )}
    </>
  );
};

type TrackData = ProteinDomainImageData['string']['string'];

type SortedTracksForResource = [string, TrackData[]];

const getSortedProteinDomainsGroups = (
  proteinDomainsResources: ProteinDomainImageData
): SortedTracksForResource[] => {
  return Object.keys(proteinDomainsResources)
    .sort()
    .map((resource) => [
      resource,
      getSortedProteinDomains(proteinDomainsResources[resource])
    ]);
};

const getSortedProteinDomains = (
  domainsGroup: Record<string, Omit<TrackData, 'name'>>
): TrackData[] => {
  return Object.entries(domainsGroup)
    .sort(([, a], [, b]) => {
      if (!a.description && b.description) {
        // if the first element doesn't have a description, but the second does, swap them
        return 1;
      } else if (!a.description || !b.description) {
        return 0;
      }
      // by this point, all elements should have description; so we can compare it
      return (
        a.description.toLowerCase().charCodeAt(0) -
        b.description.toLowerCase().charCodeAt(0)
      );
    })
    .map(([name, domain]) => ({ ...domain, name }));
};

const getProteinDomainsTrackDescription = (
  trackData: Pick<
    TrackData,
    'descriptionFromClosestDataProvider' | 'description'
  >
) =>
  trackData.descriptionFromClosestDataProvider || trackData.description || '-';

export default ProteinDomainImage;
