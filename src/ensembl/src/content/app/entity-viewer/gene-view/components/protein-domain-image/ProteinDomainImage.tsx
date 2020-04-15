import React from 'react';
import classNames from 'classnames';
import { scaleLinear, ScaleLinear } from 'd3';

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { ProteinDomainsResources } from 'src/content/app/entity-viewer/types/product';

import styles from './ProteinDomainImage.scss';

const BLOCK_HEIGHT = 18;
const TRACK_HEIGHT = 24;

export type ProteinDomainImageProps = {
  transcript: Transcript;
  width: number; // available width for drawing, in pixels
  classNames?: {
    track?: string;
    domain?: string;
  };
};

type ProteinDomainImageData = {
  [resource_type: string]: {
    [resource_description: string]: {
      start: number;
      end: number;
    }[];
  };
};

export const getDomainsByResourceGroups = (
  proteinDomainsResources: ProteinDomainsResources
) => {
  const proteinDomains: ProteinDomainImageData = {};

  Object.keys(proteinDomainsResources).forEach((resourceName) => {
    if (!proteinDomains[resourceName]) {
      proteinDomains[resourceName] = {};
    }

    proteinDomainsResources[resourceName].domains.map((domain) => {
      const domainName = domain.name;

      const { start, end } = domain.location;

      if (!proteinDomains[resourceName][domainName]) {
        proteinDomains[resourceName][domainName] = [];
      }

      proteinDomains[resourceName][domainName].push({
        start: start,
        end: end
      });
    });
  });

  return proteinDomains;
};

const ProteinDomainImage = (props: ProteinDomainImageProps) => {
  const { start: transcriptStart } = getFeatureCoordinates(props.transcript);

  if (!props.transcript.product.protein_domains_resources) {
    return null;
  }

  const length = props.transcript.product.length || 0;

  const proteinDomainsResources = getDomainsByResourceGroups(
    props.transcript.product.protein_domains_resources
  );

  const scale = scaleLinear()
    .domain([1, length])
    .range([0, props.width])
    .clamp(true);

  return (
    <div className={styles.container}>
      {/* TODO: The sorting needs to be done based on the `score`? once it is available */}
      {Object.keys(proteinDomainsResources)
        .sort()
        .map((type, key) => (
          <div key={key} className={styles.resourceGroup}>
            <div className={styles.resourceName}>{type}</div>
            <div className={styles.resourceImages}>
              {Object.keys(proteinDomainsResources[type])
                .sort()
                .map((description, key) => (
                  <div key={key} className={styles.resourceImage}>
                    <svg
                      className={styles.containerSvg}
                      width={props.width}
                      height={BLOCK_HEIGHT}
                    >
                      <g>
                        <Track {...props} />
                        {proteinDomainsResources[type][description].map(
                          (domain, index) => (
                            <DomainBlock
                              key={index}
                              domain={domain}
                              transcriptStart={transcriptStart}
                              className={props.classNames?.domain}
                              scale={scale}
                            />
                          )
                        )}
                      </g>
                    </svg>
                    <div className={styles.resourceDescription}>
                      {description}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

const Track = (props: ProteinDomainImageProps) => {
  const trackClasses = classNames(styles.track, props.classNames?.track);

  // we are adjusting the width of every track segment by adding 1 px to its width.
  return (
    <g className={trackClasses}>
      <rect height={TRACK_HEIGHT} width={props.width + 1} />
    </g>
  );
};

type DomainBlockProps = {
  domain: {
    start: number;
    end: number;
  };

  transcriptStart: number;
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
      width={props.scale(props.domain.end - props.domain.start) + 1}
    />
  );
};

export default ProteinDomainImage;
