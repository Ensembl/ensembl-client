import React from 'react';
import classNames from 'classnames';
import { scaleLinear, ScaleLinear } from 'd3';

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { ProteinDomainsResources } from 'src/content/app/entity-viewer/types/product';

import styles from './ProteinDomainImage.scss';

const BLOCK_HEIGHT = 18;
const BACKBONE_HEIGHT = 24;

export type ProteinDomainImageProps = {
  transcript: Transcript;
  width: number; // available width for drawing, in pixels
  classNames?: {
    backbone?: string;
    exon?: string;
    domain: string;
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

  Object.values(proteinDomainsResources).map((resource) => {
    const resourceName = resource.name;

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

  const length = props.transcript.product?.length || 0;

  const proteinDomainsResources = getDomainsByResourceGroups(
    props.transcript.product?.protein_domains_resources
  );

  const scale = scaleLinear()
    .domain([1, length])
    .range([1, props.width])
    .clamp(true);

  const domainClasses = classNames(styles.domain, props.classNames?.domain);

  return (
    <div className={styles.container}>
      {/* TODO: The sorting needs to be done based on the `score`? once it is available */}
      {Object.keys(proteinDomainsResources)
        .sort()
        .map((type, key) => {
          return (
            <div key={key} className={styles.resourceGroup}>
              <div className={styles.resourceName}>{type}</div>
              <div className={styles.resourceImages}>
                {Object.keys(proteinDomainsResources[type])
                  .sort()
                  .map((description, key) => {
                    return (
                      <div key={key} className={styles.resourceImage}>
                        <svg
                          className={styles.containerSvg}
                          width={props.width}
                          height={BLOCK_HEIGHT}
                        >
                          <g className={domainClasses}>
                            <Backbone {...props} scale={scale} />
                            {proteinDomainsResources[type][description].map(
                              (exon, index) => (
                                <ExonBlock
                                  key={index}
                                  exon={exon}
                                  transcriptStart={transcriptStart}
                                  className={props.classNames?.exon}
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
                    );
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

const Backbone = (
  props: ProteinDomainImageProps & { scale: ScaleLinear<number, number> }
) => {
  const backboneClasses = classNames(
    styles.backbone,
    props.classNames?.backbone
  );

  // we are adjusting the width of every backbone segment by adding 2 points from its width.
  return (
    <g className={backboneClasses}>
      <rect height={BACKBONE_HEIGHT} width={props.width + 2} />
    </g>
  );
};

type ExonBlockProps = {
  exon: {
    start: number;
    end: number;
  };

  transcriptStart: number;
  className?: string;
  scale: ScaleLinear<number, number>;
};

const ExonBlock = (props: ExonBlockProps) => {
  const y = 3;
  const exonClasses = classNames(styles.exon, props.className);

  const classes = classNames(exonClasses);

  return (
    <rect
      key={props.exon.start}
      className={classes}
      y={y}
      height={BLOCK_HEIGHT}
      x={props.scale(props.exon.start)}
      width={props.scale(props.exon.end - props.exon.start)}
    />
  );
};

export default ProteinDomainImage;
