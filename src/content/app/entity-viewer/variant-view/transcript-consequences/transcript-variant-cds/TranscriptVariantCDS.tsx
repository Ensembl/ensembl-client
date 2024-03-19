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
import type { Pick2 } from 'ts-multipick';
import { scaleLinear, interpolateRound, ScaleLinear } from 'd3';

import { measureText } from 'src/shared/helpers/textHelpers';

import ChevronDown from 'static/icons/icon_chevron.svg';

import type { SplicedExon } from 'src/shared/types/core-api/exon';
import type { FullCDS } from 'src/shared/types/core-api/cds';
import type { VariantRelativeLocation } from 'src/shared/types/variation-api/variantPredictedMolecularConsequence';
import type { ExonWithRelativeLocationInCDS } from 'src/shared/helpers/exon-helpers/exonHelpers';

import styles from './TranscriptVariantCDS.module.css';

type ExonFields = Pick<SplicedExon, 'index'> &
  Pick2<SplicedExon, 'relative_location', 'start' | 'end'>;
type CDSFields = Pick<
  FullCDS,
  'relative_start' | 'relative_end' | 'nucleotide_length'
>;
type VariantRelativeLocationFields = Pick<
  VariantRelativeLocation,
  'start' | 'end'
>;

/**
 * WARNING!
 * This component is using spliced exons from the core api to draw a CDS diagram.
 * This will fail to work if we ever get cases of trans-splicing.
 * It should be api's responsibility to tell the client how exons are arranged along a CDS.
 */

type Props = {
  exons: Array<ExonFields & ExonWithRelativeLocationInCDS>;
  cds: CDSFields;
  allele: {
    type: string;
    relativeLocation: VariantRelativeLocationFields;
  };
};

const DIAGRAM_WIDTH = 700;
const MIN_EXON_BLOCK_WIDTH = 2;
const EXON_MARGIN_WIDTH = 1;
const EXON_BLOCK_HEIGHT = 12;
const MIN_EXON_BLOCK_WITH_ARROW_WIDTH = 18;
const VARIANT_MARKER_HEIGHT = 18;
const VATIANT_MARKER_WIDTH = 2;
const DIAGRAM_HEIGHT = 42;
const EXON_TO_LABEL_DISTANCE = 12; // distance between the bottom of exon blocks and the top of the label under the variant mark

const EXON_BLOCK_OFFSET_TOP = (VARIANT_MARKER_HEIGHT - EXON_BLOCK_HEIGHT) / 2;

const TranscriptVariantCDS = (props: Props) => {
  const { exons, allele, cds } = props;

  const scale = scaleLinear()
    .domain([0, cds.nucleotide_length])
    .range([0, DIAGRAM_WIDTH])
    .interpolate(interpolateRound)
    .clamp(true);

  const exonsWithWidths = getExonWidths({
    exons,
    containerWidth: DIAGRAM_WIDTH,
    scale
  });

  return (
    <svg
      width={DIAGRAM_WIDTH}
      height={DIAGRAM_HEIGHT}
      viewBox={`0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`}
      overflow="visible"
    >
      <Exons exons={exonsWithWidths} />
      <VariantMark
        exons={exonsWithWidths}
        allele={allele}
        scale={scale}
        containerWidth={DIAGRAM_WIDTH}
      />
    </svg>
  );
};

const Exons = (props: { exons: Array<{ width: number }> }) => {
  let x = 0;

  const exonBlocks = props.exons.map((exon, index) => {
    const width = exon.width;
    const currentX = x;
    x += width + EXON_MARGIN_WIDTH;

    return <ExonBlock key={index} x={currentX} width={width} />;
  });

  return <g>{exonBlocks}</g>;
};

const ExonBlock = (props: { x: number; width: number }) => {
  const { x, width } = props;
  const initialChevronWidth = 32; // <-- from the viewBox attribute of the svg image, in which the chevron is pointing down
  const initialChevronHeight = 20; // <-- from the viewBox attribute of the svg image, in which the chevron is pointing down
  const targetChevronWidth = 9; // <-- before rotating the chevron 90°; after the rotation this will become its height
  const targetChevronHeight =
    initialChevronHeight * (targetChevronWidth / initialChevronWidth);

  const exonRectangle = (
    <rect
      className={styles.exonBlock}
      x={x}
      y={EXON_BLOCK_OFFSET_TOP}
      width={width}
      height={EXON_BLOCK_HEIGHT}
    />
  );

  if (width >= MIN_EXON_BLOCK_WITH_ARROW_WIDTH) {
    const arrowX = x + width / 2 - targetChevronWidth;

    // for each arrow, define the rotation origin to be exactly in the middle of the arrow
    const rotateOriginX = arrowX + targetChevronWidth / 2;
    const rotateOriginY = EXON_BLOCK_OFFSET_TOP + EXON_BLOCK_HEIGHT / 2;

    return (
      <>
        {exonRectangle}
        {/* 
          Wrapping ChevronDown in a group element,
          because browsers have not yet implemented transform attribute on svg element itself;
          and therefore, we cannot rotate the chevron directly
          (https://stackoverflow.com/a/50416852/3925302)
        */}
        <g transform={`rotate(-90 ${rotateOriginX} ${rotateOriginY})`}>
          <ChevronDown
            className={styles.exonBlockArrow}
            x={arrowX}
            y={EXON_BLOCK_OFFSET_TOP + EXON_BLOCK_HEIGHT / 2}
            width={targetChevronWidth}
            height={targetChevronHeight}
          />
        </g>
      </>
    );
  } else {
    return exonRectangle;
  }
};

const VariantMark = (props: {
  exons: ReturnType<typeof getExonWidths>;
  allele: Props['allele'];
  scale: ScaleLinear<number, number>;
  containerWidth: number;
}) => {
  const { allele, scale } = props;

  const variantPosition =
    allele.relativeLocation.start || allele.relativeLocation.end;

  if (!variantPosition) {
    // This shouldn't happen. If we are here, our CDS diagram is useless, because we can't project the variant onto the CDS
    return null;
  }

  const x = Math.min(
    scale(variantPosition),
    DIAGRAM_WIDTH - VATIANT_MARKER_WIDTH // make sure the mark does not extend beyond the boundaries of the diagram
  );

  return (
    <>
      <rect x={x} width={VATIANT_MARKER_WIDTH} height={VARIANT_MARKER_HEIGHT} />
      <VariantMarkLabel {...props} markX={x} />
    </>
  );
};

const VariantMarkLabel = (props: {
  exons: ReturnType<typeof getExonWidths>;
  allele: Props['allele'];
  markX: number; // the x-coordinate for positioning the variant mark
  containerWidth: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { allele, exons, markX, containerWidth } = props;

  const totalCodingExonsCount = exons.length;
  const variantPosition = (allele.relativeLocation.start ||
    allele.relativeLocation.end) as number;

  let affectedExonNumber = 1;

  for (let i = 0; i < exons.length; i++) {
    const exon = exons[i];
    const exonStart = exon.relative_location_in_cds!.start;
    const exonEnd = exon.relative_location_in_cds!.end;

    if (variantPosition >= exonStart && variantPosition <= exonEnd) {
      affectedExonNumber = i + 1;
      break;
    }
  }

  const labelText = `Coding exon ${affectedExonNumber} of ${totalCodingExonsCount}`;
  const labelFont = '11px Lato';
  const labelFontSize = 11;
  const labelY =
    EXON_BLOCK_HEIGHT + EXON_BLOCK_OFFSET_TOP + EXON_TO_LABEL_DISTANCE;

  const { width: predictedLabelWidth } = measureText({
    text: labelText,
    font: labelFont
  });

  let labelX = markX;
  let textAnchor = 'middle';

  if (predictedLabelWidth / 2 > labelX) {
    labelX = 0;
    textAnchor = 'start';
  } else if (labelX + predictedLabelWidth / 2 > containerWidth) {
    labelX = containerWidth;
    textAnchor = 'end';
  }

  return (
    <text
      alignmentBaseline="hanging"
      className={styles.label}
      textAnchor={textAnchor}
      x={labelX}
      y={labelY}
      fontSize={labelFontSize}
    >
      Coding exon{' '}
      <tspan className={styles.labelBold} alignmentBaseline="hanging">
        {affectedExonNumber}
      </tspan>{' '}
      of {exons.length}
    </text>
  );
};

const getExonWidths = (params: {
  exons: Props['exons'];
  containerWidth: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { exons, scale, containerWidth } = params;

  const exonBlocks = exons.map((exon, index) => ({
    ...exon,
    width:
      index === exons.length - 1
        ? scale(exon.relative_location_in_cds!.length)
        : scale(exon.relative_location_in_cds!.length) - EXON_MARGIN_WIDTH
  }));

  return adjustExonWidths({ exonBlocks, containerWidth });
};

export const adjustExonWidths = <
  T extends { index: number; width: number }
>(params: {
  exonBlocks: Array<T>;
  containerWidth: number;
}) => {
  const { exonBlocks, containerWidth } = params;
  const maxExonBlocksCount = Math.floor(
    containerWidth / (EXON_MARGIN_WIDTH + MIN_EXON_BLOCK_WIDTH)
  );

  if (maxExonBlocksCount <= exonBlocks.length) {
    return exonBlocks.slice(0, maxExonBlocksCount).map((exon) => ({
      ...exon,
      width: MIN_EXON_BLOCK_WIDTH
    }));
  }

  // sort by width, shortest to longest
  exonBlocks.sort((exonA, exonB) => exonA.width - exonB.width);

  let currentDonorExonIndex = exonBlocks.length - 1;

  for (const exon of exonBlocks) {
    if (exon.width < MIN_EXON_BLOCK_WIDTH) {
      const extraWidth = MIN_EXON_BLOCK_WIDTH - exon.width;

      const anchorIndex = currentDonorExonIndex; // to break the while-loop if needed
      let hasWrappedAround = false;

      while (!(hasWrappedAround && currentDonorExonIndex === anchorIndex)) {
        const donorExonBlock = exonBlocks[currentDonorExonIndex];

        if (donorExonBlock.width > MIN_EXON_BLOCK_WIDTH) {
          donorExonBlock.width -= extraWidth;
          exon.width += extraWidth;
          currentDonorExonIndex -= 1;
          break;
        }

        if (currentDonorExonIndex === 0) {
          hasWrappedAround = true;
        }

        if (currentDonorExonIndex > 0) {
          currentDonorExonIndex -= 1;
        } else {
          currentDonorExonIndex = exonBlocks.length - 1;
        }
      }
    }
  }

  // sort by index
  exonBlocks.sort((exonA, exonB) => exonA.index - exonB.index);

  return exonBlocks;
};

export default TranscriptVariantCDS;
