import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { scaleLinear, ScaleLinear } from 'd3';

import { fetchTranscript } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';

import {
  ProteinDomainsResources,
  Product
} from 'src/content/app/entity-viewer/types/product';

import styles from './ProteinDomainImage.scss';

const BLOCK_HEIGHT = 18;
const TRACK_HEIGHT = 24;

export type ProteinDomainImageProps = {
  transcriptId: string;
  width: number; // available width for drawing, in pixels
  classNames?: {
    track?: string;
    domain?: string;
  };
};

type ProteinDomainImageWithDataProps = Omit<
  ProteinDomainImageProps,
  'transcriptId'
> & {
  protein: Product;
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

    proteinDomainsResources[resourceName].domains.forEach((domain) => {
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
  const [data, setData] = useState<Product | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    fetchTranscript(props.transcriptId, abortController.signal).then(
      (result) => {
        if (result?.product) {
          setData(result.product);
        }
      }
    );

    return function cleanup() {
      abortController.abort();
    };
  }, [props.transcriptId]);

  return data ? <ProteinDomainImageWithData {...props} protein={data} /> : null;
};

export const ProteinDomainImageWithData = (
  props: ProteinDomainImageWithDataProps
) => {
  const { protein } = props;

  if (!protein?.protein_domains_resources) {
    return null;
  }

  const proteinDomainsResources = getDomainsByResourceGroups(
    protein.protein_domains_resources
  );
  const scale = scaleLinear()
    .domain([1, protein.length])
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

export default ProteinDomainImage;
