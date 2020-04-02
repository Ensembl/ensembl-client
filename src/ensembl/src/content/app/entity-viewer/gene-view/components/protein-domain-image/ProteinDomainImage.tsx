import React from 'react';
import classNames from 'classnames';

import { scaleLinear, ScaleLinear } from 'd3';

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { ProteinFeature } from 'src/content/app/entity-viewer/types/protein-feature';

import styles from './ProteinDomainImage.scss';

const BLOCK_HEIGHT = 18;
const BACKBONE_HEIGHT = 24;

export type ProteinDomainImageProps = {
  transcript: Transcript;
  width: number; // available width for drawing, in pixels
  classNames?: {
    backbone?: string;
    exon?: string;
    transcript: string;
  };
};

type ProteinDomainImageData = {
  [feature_type: string]: {
    [feature_description: string]: {
      start: number;
      end: number;
    }[];
  };
};

export const getProteinFeaturesByType = (proteinFeatures: ProteinFeature[]) => {
  const proteinDomains: ProteinDomainImageData = {};

  proteinFeatures.map((feature) => {
    const { start, end, type, description } = feature;

    if (!proteinDomains[type]) {
      proteinDomains[type] = {};
    }

    if (!proteinDomains[type][description]) {
      proteinDomains[type][description] = [];
    }

    proteinDomains[type][description].push({
      start: start,
      end: end
    });
  });

  return proteinDomains;
};

const ProteinDomainImage = (props: ProteinDomainImageProps) => {
  const { start: transcriptStart } = getFeatureCoordinates(props.transcript);

  if (!props.transcript.translation) {
    return null;
  }

  const length = props.transcript.translation?.length || 0;

  const proteinFeatures = getProteinFeaturesByType(
    props.transcript.translation.protein_features
  );

  const scale = scaleLinear()
    .domain([1, length])
    .range([1, props.width])
    .clamp(true);

  const transcriptClasses = classNames(
    styles.transcript,
    props.classNames?.transcript
  );

  return (
    <div className={styles.container}>
      {Object.keys(proteinFeatures).map((type, key) => {
        return (
          <div key={key} className={styles.featureGroup}>
            <div className={styles.featureType}>{type}</div>
            <div className={styles.featureImages}>
              {Object.keys(proteinFeatures[type]).map((description, key) => {
                return (
                  <div key={key} className={styles.featureImage}>
                    <svg
                      className={styles.containerSvg}
                      width={props.width}
                      height={BLOCK_HEIGHT}
                    >
                      <g className={transcriptClasses}>
                        <Backbone {...props} scale={scale} />
                        {proteinFeatures[type][description].map(
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
                    <div className={styles.featureDescription}>
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
