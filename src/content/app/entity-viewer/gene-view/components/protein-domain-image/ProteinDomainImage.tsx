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

import React from 'react';
import classNames from 'classnames';
import { scaleLinear, ScaleLinear } from 'd3';

import type { FamilyMatchInProduct } from 'src/content/app/entity-viewer/state/api/queries/proteinDomainsQuery';

import styles from './ProteinDomainImage.scss';

const BLOCK_HEIGHT = 18;
const TRACK_HEIGHT = 24;

export type ProteinDomainImageProps = {
  proteinDomains: FamilyMatchInProduct[];
  trackLength: number;
  width: number; // available width for drawing, in pixels
  classNames?: {
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
      description: string;
      locations: ProteinDomainLocation[];
    };
  };
};

export const getDomainsByResourceGroups = (
  proteinDomains: FamilyMatchInProduct[]
) => {
  const groupedDomains: ProteinDomainImageData = {};

  proteinDomains.forEach((domain) => {
    const {
      sequence_family: { name: domainName, description },
      sequence_family: {
        source: { name: resource_name }
      },
      relative_location: { start, end }
    } = domain;

    if (!groupedDomains[resource_name]) {
      groupedDomains[resource_name] = {};
    }
    if (!groupedDomains[resource_name][domainName]) {
      groupedDomains[resource_name][domainName] = {
        description: description,
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
                <div key={index} className={styles.resourceImage}>
                  <svg
                    className={styles.containerSvg}
                    width={props.width}
                    height={BLOCK_HEIGHT}
                  >
                    <g>
                      <Track {...props} />
                      {trackData.locations.map((domain, index) => (
                        <DomainBlock
                          key={index}
                          domain={domain}
                          className={props.classNames?.domain}
                          scale={scale}
                        />
                      ))}
                    </g>
                  </svg>

                  <div className={styles.resourceDescription}>
                    {trackData.description ?? '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
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
  className?: string;
  scale: ScaleLinear<number, number>;
};

const DomainBlock = (props: DomainBlockProps) => {
  const y = 3;
  const domainClasses = classNames(styles.domain, props.className);

  return (
    <rect
      key={props.domain.start}
      className={domainClasses}
      y={y}
      height={BLOCK_HEIGHT}
      x={props.scale(props.domain.start)}
      width={props.scale(props.domain.end - props.domain.start + 1)}
    />
  );
};

type TrackData = {
  name: string;
  description: string | null;
  locations: ProteinDomainLocation[];
};

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

export default ProteinDomainImage;
